import { SocketContext } from 'contexts/socket';
import { useContext, useEffect } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { isTablet, isDesktop } from 'react-device-detect';

import 'xterm/css/xterm.css';

const Body = () => {
    const socket = useContext(SocketContext);

    const terminal = new Terminal({
        cursorBlink: true,
        scrollSensitivity: 2,
        rows: 36,
        fontSize: isDesktop || isTablet ? 16 : 10,
    });
    const fitAddon = new FitAddon();

    const DEFAULT_CURSOR_X = 3;
    let input = 0;

    useEffect(() => {
        terminalInit();

        return () => {
            socket.off('output');
        };
    }, []);

    const terminalInit = () => {
        terminal.open(document.getElementById('terminal') as HTMLElement);

        terminal.onKey((e) => onKeyHandler(e));
        terminal.onData((e) => onDataHandler(e));
        terminal.loadAddon(fitAddon);

        socket.emit('init');

        socket.on('output', (data) => {
            terminal.write(data);
        });

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
