import { beforeEach, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from 'components/Home';
import Chat from 'components/Home/Chat';
import { getChat } from 'api/chat';

const mocks = vi.hoisted(() => {
    const socket = { on: vi.fn(), once: vi.fn(), emit: vi.fn(), disconnect: vi.fn() };
    const canvas = { scale: vi.fn(), drawImage: vi.fn(), clearRect: vi.fn(), imageSmoothingEnabled: true };
    return { socket, canvas, router: { events: { on: vi.fn(), off: vi.fn() } } };
});
vi.mock('socket.io-client', () => ({ io: () => mocks.socket }));
vi.mock('api/chat', () => ({ getChat: vi.fn() }));
vi.mock('next/router', () => ({ useRouter: () => mocks.router }));
vi.mock('next/head', () => ({ default: () => null }));

const posts = [
    { SK: 'old', Title: 'Older article', Content: '', CreatedAt: '2026-01-01', Tags: ['go'] },
    { SK: 'new', Title: 'New article', Content: '', CreatedAt: '2026-01-02', Tags: null },
];
beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
        mocks.canvas as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'clientWidth', 'get').mockReturnValue(64);
    vi.spyOn(HTMLCanvasElement.prototype, 'clientHeight', 'get').mockReturnValue(64);
    vi.stubGlobal(
        'ImageData',
        class {
            constructor(
                public data: Uint8ClampedArray,
                public width: number,
                public height: number
            ) {}
        }
    );
    vi.stubGlobal(
        'createImageBitmap',
        vi.fn(async (image) => image)
    );
    vi.mocked(getChat).mockResolvedValue({ data: [{ content: 'history', createdAt: '2026-01-01' }] } as never);
});

it('sorts articles, searches titles, restores scroll and unregisters route listeners', () => {
    sessionStorage.setItem('scrollPosition', '120');
    Object.defineProperty(history, 'scrollRestoration', { value: 'auto', writable: true, configurable: true });
    const view = render(<Home posts={posts} />);
    expect(
        screen
            .getAllByRole('link')
            .filter((a) => a.getAttribute('href')?.startsWith('post/'))
            .map((a) => a.textContent)
    ).toEqual(['New article', 'Older article']);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 120);
    expect(sessionStorage.getItem('scrollPosition')).toBeNull();
    expect(history.scrollRestoration).toBe('manual');
    const search = view.container.querySelector('#search') as HTMLInputElement;
    expect(search.hidden).toBe(true);
    fireEvent.click(search.closest('div')!.querySelector('svg')!);
    expect(search.hidden).toBe(false);
    fireEvent.change(search, { target: { value: 'Older' } });
    expect(screen.queryByText('New article')).not.toBeInTheDocument();
    expect(screen.getByText('#go')).toBeInTheDocument();
    const routeHandler = mocks.router.events.on.mock.calls[0][1];
    routeHandler();
    expect(sessionStorage.getItem('scrollPosition')).toBe(String(window.scrollY));
    view.unmount();
    expect(mocks.router.events.off).toHaveBeenCalledWith('routeChangeStart', routeHandler);
    render(<Home posts={[]} />);
    expect(screen.queryByText('Older article')).not.toBeInTheDocument();
});

it('receives remote pixels, sends real editor strokes in the chosen color and disconnects on unmount', async () => {
    const view = render(<Home posts={[]} />);
    const init = mocks.socket.once.mock.calls.find(([name]) => name === 'init')![1];
    init({ colors: ['000000', '00ff00'], data: { '1,1': [1, 1] } });
    const merge = mocks.socket.on.mock.calls.find(([name]) => name === 'merge')![1];
    merge({ colors: ['000000', '00ff00'], data: { '2,2': [1, 1] } });
    const clear = mocks.socket.on.mock.calls.find(([name]) => name === 'clear')![1];
    clear();
    expect(mocks.canvas.clearRect).toHaveBeenCalled();
    fireEvent.input(view.container.querySelector('input[type=color]')!, { target: { value: '#ff0000' } });
    const canvas = view.container.querySelector('canvas')!;
    canvas.setPointerCapture = vi.fn();
    canvas.hasPointerCapture = vi.fn(() => true);
    fireEvent.pointerDown(canvas, { pointerId: 1 });
    expect(mocks.socket.emit).toHaveBeenCalledWith('write', { colors: ['000000', 'ff0000'], data: { '0,0': [1, 1] } });
    await waitFor(() => expect(mocks.canvas.drawImage).toHaveBeenCalledTimes(3));
    const remoteImage = mocks.canvas.drawImage.mock.calls[0][0];
    expect(Array.from(remoteImage.data.slice((64 + 1) * 4, (64 + 1) * 4 + 4))).toEqual([0, 255, 0, 255]);
    fireEvent.click(view.container.querySelector('header svg')!);
    expect(mocks.socket.emit).toHaveBeenCalledWith('clear');
    view.unmount();
    expect(mocks.socket.disconnect).toHaveBeenCalled();
});

it('loads chat history, waits for connection, receives messages and sends nonempty Enter input', async () => {
    const view = render(<Chat />);
    await waitFor(() => expect(getChat).toHaveBeenCalled());
    fireEvent.click(view.container.querySelector('svg')!);
    expect(screen.getByText('Waiting...')).toBeInTheDocument();
    const handlers = Object.fromEntries(mocks.socket.on.mock.calls);
    act(() => handlers.connect());
    await screen.findByText('history');
    act(() => handlers.chat({ content: 'incoming', createdAt: '2026-01-02' }));
    expect(screen.getByText('incoming')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mocks.socket.emit).not.toHaveBeenCalled();
    fireEvent.change(input, { target: { value: 'hello' } });
    fireEvent.keyDown(input, { key: 'a' });
    expect(mocks.socket.emit).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mocks.socket.emit).toHaveBeenCalledWith('create', 'hello');
    expect(input).toHaveValue('');
    act(() => handlers.disconnect());
    expect(screen.getByText('Waiting...')).toBeInTheDocument();
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByText('Waiting...')).not.toBeInTheDocument();
});
