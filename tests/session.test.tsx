import { beforeEach, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import SessionPage from 'pages/session';
import Session from 'components/Session';
import CountDownTTL from 'components/Session/CountDownTTL';
import * as api from 'api/session';

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/router', () => ({ useRouter: () => router }));
vi.mock('api/session', () => ({
    createClientId: vi.fn(),
    createSession: vi.fn(),
    deleteSession: vi.fn(),
    getSessions: vi.fn(),
}));
const session = { name: 'demo', sessionId: 'session1', image: 'ubuntu', description: 'workspace', ttl: 600 };

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getSessions).mockResolvedValue([session]);
    vi.mocked(api.createClientId).mockResolvedValue({ clientId: 'client02' });
    vi.mocked(api.createSession).mockResolvedValue({ ...session, sessionId: 'session2', name: 'created' });
    vi.mocked(api.deleteSession).mockResolvedValue(undefined);
});

it.fails('known regression: the first issued client ID must be available for immediate deletion', async () => {
    render(<SessionPage />);
    fireEvent.click(screen.getByText('Create Session'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'work' } });
    fireEvent.click(screen.getByText('Create', { selector: 'button' }));
    await screen.findByText('created');
    fireEvent.click(screen.getByTitle('Delete session'));
    expect(api.deleteSession).toHaveBeenCalledWith('client02', { sessionId: 'session2' });
});

it('loads persisted identity, maps session links and deletes only the selected session', async () => {
    localStorage.setItem('clientId', 'client01');
    render(<SessionPage />);
    await screen.findByText('demo');
    expect(api.getSessions).toHaveBeenCalledWith('client01');
    fireEvent.click(screen.getByTitle('Connect'));
    expect(router.push).toHaveBeenCalledWith(expect.stringContaining('token=client01:session1'));
    fireEvent.click(screen.getByTitle('Delete session'));
    await waitFor(() => expect(screen.queryByText('demo')).not.toBeInTheDocument());
    expect(api.deleteSession).toHaveBeenCalledWith('client01', { sessionId: 'session1' });
});

it.each([true, false])('creates a session with %s existing identity and resets/closes the form', async (existing) => {
    if (existing) localStorage.setItem('clientId', 'client01');
    render(<SessionPage />);
    if (existing) await screen.findByText('demo');
    fireEvent.click(screen.getByText('Create Session'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: ' work ' } });
    fireEvent.change(screen.getByLabelText('Image'), { target: { value: 'ubuntu' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: ' test ' } });
    fireEvent.click(screen.getByText('Create', { selector: 'button' }));
    await screen.findByText('created');
    expect(api.createSession).toHaveBeenCalledWith(existing ? 'client01' : 'client02', {
        name: 'work',
        image: 'ubuntu',
        description: 'test',
    });
    expect(api.createClientId).toHaveBeenCalledTimes(existing ? 0 : 1);
    if (!existing) expect(localStorage.getItem('clientId')).toBe('client02');
    expect(screen.queryByText('Create New Session')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Create Session'));
    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Image')).toHaveValue('debian-xfce');
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Create New Session')).not.toBeInTheDocument();
});

it.each(['load', 'create', 'delete'] as const)('shows %s failures and keeps existing resources', async (operation) => {
    localStorage.setItem('clientId', 'client01');
    if (operation === 'load') vi.mocked(api.getSessions).mockRejectedValueOnce(new Error('offline'));
    if (operation === 'create') vi.mocked(api.createSession).mockRejectedValueOnce(new Error('offline'));
    if (operation === 'delete') vi.mocked(api.deleteSession).mockRejectedValueOnce(new Error('offline'));
    render(<SessionPage />);
    if (operation === 'load') {
        await screen.findByText('Failed to load sessions');
        return;
    }
    await screen.findByText('demo');
    if (operation === 'create') {
        fireEvent.click(screen.getByText('Create Session'));
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'work' } });
        fireEvent.click(screen.getByText('Create', { selector: 'button' }));
        await screen.findByText('failed to create session');
    } else {
        fireEvent.click(screen.getByTitle('Delete session'));
        await screen.findByText('cannot delete session');
    }
    expect(screen.getByText('demo')).toBeInTheDocument();
});

it('resets canceled modal values and renders creating, running and expired session states', () => {
    vi.useFakeTimers();
    const create = vi.fn();
    const remove = vi.fn();
    const props = {
        loading: true,
        errorMessage: null,
        sessions: [{ ...session, ttl: 2, description: '', id: 'session1', href: '/vnc' }],
        onCreateSession: create,
        onDeleteSession: remove,
    };
    const view = render(<Session {...props} />);
    expect(screen.getByText('Creating')).toBeInTheDocument();
    view.rerender(<Session {...props} loading={false} />);
    expect(screen.getByText('Running')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Create Session'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'discard' } });
    fireEvent.click(screen.getByText('Cancel'));
    fireEvent.click(screen.getByText('Create Session'));
    expect(screen.getByLabelText('Name')).toHaveValue('');
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'new' } });
    fireEvent.click(screen.getByText('Create', { selector: 'button' }));
    expect(create).toHaveBeenCalledWith({ name: 'new', image: 'debian-xfce', description: '' });
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText('Expired')).toBeInTheDocument();
});

it('counts down once per second, invokes expiry and clears the timer on unmount', () => {
    vi.useFakeTimers();
    const expired = vi.fn();
    const view = render(<CountDownTTL ttl={2} onExpired={expired} />);
    expect(screen.getByText('0:02')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('0:01')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('0:00')).toBeInTheDocument();
    expect(expired).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
    render(<CountDownTTL ttl={-1} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
});
