import { useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { io } from 'socket.io-client';

import '@xterm/xterm/css/xterm.css';

const Body = () => {
    const socket = io(
        process.env.NODE_ENV === 'production'
            ? `${process.env.NEXT_PUBLIC_TERMINAL_SOCKET_URL}`
            : 'http://localhost:3000/terminal',
        {
            transports: ['websocket'],
        }
    );

    const isLong = screen.height > 1080;
    const isDesktop = screen.width > 1080;
    const isTablet = screen.width >= 768 && screen.width <= 1080;

    const terminal = new Terminal({
        cursorBlink: true,
        scrollSensitivity: 2,
        rows: isLong ? 60 : 40,
        fontSize: isDesktop || isTablet ? 16 : 10,
    });
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    const DEFAULT_CURSOR_X = 3;
    let input = 0;

    useEffect(() => {
        terminalInit();

        return () => {
            socket.disconnect();
        };
    }, []);

    const terminalInit = () => {
        terminal.open(document.getElementById('terminal') as HTMLElement);

        terminal.onKey((e) => onKeyHandler(e));
        terminal.onData((e) => onDataHandler(e));

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(webLinksAddon);

        socket.emit('init');

        socket.on('output', onOutputHandler);

        fitAddon.fit();
    };

    const onDataHandler = (command: string) => {
        socket.emit('input', command);
    };

    const onKeyHandler = (e: { key: string; domEvent: KeyboardEvent }) => {
        const { key } = e.domEvent;

        switch (key) {
            case 'Enter':
                enter();
                break;
            case 'Backspace':
                backspace();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowLeft':
                moveLeft();
                break;
            default:
                input += 1;
        }
    };

    const onOutputHandler = (data: string) => {
        terminal.write(data);
    };

    const enter = () => {
        input = 0;
    };

    const backspace = () => {
        if (terminal.buffer.active.cursorX >= DEFAULT_CURSOR_X) {
            terminal.write('\x1B[0J');
            input -= 1;
        }
    };

    const moveRight = () => {
        const isEnd = terminal.buffer.active.cursorX - DEFAULT_CURSOR_X <= input;

        if (!isEnd) {
            terminal.write('\x1B[C');
        }
    };

    const moveLeft = () => {
        const isStart = terminal.buffer.active.cursorX > DEFAULT_CURSOR_X + input;

        if (isStart) {
            terminal.write('\x1B[D');
        }
    };

    return <div id="terminal" />;
};
export default Body;
