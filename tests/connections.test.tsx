import { beforeEach, expect, it, vi } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import Me from 'components/Me';
import Vnc from 'components/Vnc';

const mocks = vi.hoisted(() => ({
    socket: { on: vi.fn(), emit: vi.fn(), disconnect: vi.fn() },
    terminal: {
        open: vi.fn(),
        onKey: vi.fn(),
        onData: vi.fn(),
        loadAddon: vi.fn(),
        write: vi.fn(),
        buffer: { active: { cursorX: 3 } },
    },
    terminalOptions: vi.fn(),
    fit: vi.fn(),
    rfb: {
        addEventListener: vi.fn(),
        disconnect: vi.fn(),
        scaleViewport: false,
        viewOnly: true,
        qualityLevel: 0,
        compressionLevel: 0,
    },
    rfbOptions: vi.fn(),
    router: { replace: vi.fn(), events: { on: vi.fn(), off: vi.fn() } },
}));
declare const jsdom: { reconfigure(options: { url: string }): void };
vi.mock('socket.io-client', () => ({ io: () => mocks.socket }));
vi.mock('@xterm/xterm', () => ({
    Terminal: class {
        constructor(options) {
            mocks.terminalOptions(options);
            return mocks.terminal;
        }
    },
}));
vi.mock('@xterm/addon-fit', () => ({
    FitAddon: class {
        fit = mocks.fit;
    },
}));
vi.mock('@xterm/addon-web-links', () => ({ WebLinksAddon: class {} }));
vi.mock('../components/Vnc/core/rfb.js', () => ({
    default: class {
        constructor(...args) {
            mocks.rfbOptions(...args);
            return mocks.rfb;
        }
    },
}));
vi.mock('next/router.js', () => ({ default: mocks.router }));

beforeEach(() => {
    vi.clearAllMocks();
    mocks.terminal.buffer.active.cursorX = 3;
    jsdom.reconfigure({ url: 'http://localhost:3000/' });
});

it.each([
    [1440, 1200, 60, 16],
    [800, 900, 40, 16],
    [400, 700, 40, 10],
])(
    'initializes terminal at %s screen width and forwards input/output with cleanup',
    (width, height, rows, fontSize) => {
        Object.defineProperties(window.screen, {
            width: { value: width, configurable: true },
            height: { value: height, configurable: true },
        });
        const view = render(<Me />);
        expect(screen.getByRole('heading', { name: '소개' })).toBeInTheDocument();
        expect(mocks.terminalOptions).toHaveBeenCalledWith(expect.objectContaining({ rows, fontSize }));
        expect(mocks.terminal.open).toHaveBeenCalledWith(view.container.querySelector('#terminal'));
        expect(mocks.terminal.loadAddon).toHaveBeenCalledTimes(2);
        expect(mocks.fit).toHaveBeenCalled();
        expect(mocks.socket.emit).toHaveBeenCalledWith('init');
        const data = mocks.terminal.onData.mock.calls[0][0];
        data('ls\r');
        expect(mocks.socket.emit).toHaveBeenCalledWith('input', 'ls\r');
        const output = mocks.socket.on.mock.calls.find(([name]) => name === 'output')![1];
        output('result');
        expect(mocks.terminal.write).toHaveBeenCalledWith('result');
        const key = (name: string) => mocks.terminal.onKey.mock.calls[0][0]({ domEvent: { key: name } });
        key('a');
        key('b');
        key('ArrowRight');
        key('ArrowLeft');
        mocks.terminal.buffer.active.cursorX = 10;
        key('ArrowRight');
        key('ArrowLeft');
        key('Backspace');
        expect(mocks.terminal.write).toHaveBeenCalledWith('\x1B[C');
        expect(mocks.terminal.write).toHaveBeenCalledWith('\x1B[D');
        expect(mocks.terminal.write).toHaveBeenCalledWith('\x1B[0J');
        key('Enter');
        mocks.terminal.buffer.active.cursorX = 0;
        mocks.terminal.write.mockClear();
        key('Backspace');
        expect(mocks.terminal.write).not.toHaveBeenCalled();
        view.unmount();
        expect(mocks.socket.disconnect).toHaveBeenCalledTimes(1);
    }
);

it('connects VNC with URL overrides and redirects once after unexpected disconnection', async () => {
    window.history.replaceState({}, '', '/vnc?host=vnc.test&port=443&path=socket');
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const view = render(<Vnc />);
    expect(screen.getByText('Connecting…')).toBeInTheDocument();
    await waitFor(() => expect(mocks.rfbOptions).toHaveBeenCalled());
    expect(mocks.rfbOptions).toHaveBeenCalledWith(expect.any(HTMLElement), 'ws://vnc.test:443/socket', {});
    expect(mocks.rfb.scaleViewport).toBe(true);
    expect(mocks.rfb.viewOnly).toBe(false);
    const events = Object.fromEntries(mocks.rfb.addEventListener.mock.calls);
    act(() => events.connect());
    expect(screen.queryByText('Connecting…')).not.toBeInTheDocument();
    act(() => {
        events.disconnect();
        events.disconnect();
    });
    expect(alert).toHaveBeenCalledTimes(1);
    expect(mocks.router.replace).toHaveBeenCalledWith('/session');
    expect(screen.getByText('Connecting…')).toBeInTheDocument();
    view.unmount();
    expect(mocks.rfb.disconnect).toHaveBeenCalled();
    expect(mocks.router.events.off).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
});

it.each(['route', 'unload'])('closes VNC quietly when the user leaves by %s', async (leave) => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const view = render(<Vnc />);
    await waitFor(() => expect(mocks.rfbOptions).toHaveBeenCalled());
    expect(mocks.rfbOptions.mock.calls[0][1]).toMatch(/\/websockify$/);
    if (leave === 'route') mocks.router.events.on.mock.calls[0][1]();
    else window.dispatchEvent(new Event('beforeunload'));
    const disconnect = mocks.rfb.addEventListener.mock.calls.find(([name]) => name === 'disconnect')![1];
    act(() => disconnect());
    expect(alert).not.toHaveBeenCalled();
    expect(mocks.router.replace).not.toHaveBeenCalled();
    view.unmount();
    expect(mocks.rfb.disconnect).toHaveBeenCalledTimes(1);
});

it('uses secure WebSocket and the default host/path without an unnecessary port on HTTPS', async () => {
    jsdom.reconfigure({ url: 'https://client.test/vnc' });
    const view = render(<Vnc />);
    await waitFor(() => expect(mocks.rfbOptions).toHaveBeenCalled());
    expect(mocks.rfbOptions.mock.calls[0][1]).toBe('wss://client.test/websockify');
    view.unmount();
});

it('does not establish a VNC connection if unmounted before the browser widget finishes loading', async () => {
    const view = render(<Vnc />);
    await act(async () => view.unmount());
    expect(mocks.rfbOptions).not.toHaveBeenCalled();
});
