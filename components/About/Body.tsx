import { SocketContext } from 'contexts/socket';
import { useContext, useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'xterm/css/xterm.css';

const Body = () => {
    const socket = useContext(SocketContext);

    const terminal = new Terminal({ cursorBlink: true, scrollSensitivity: 2 });
    const fitAddon = new FitAddon();

    const [input, setInput] = useState(0);

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
        // const printable = !e.domEvent.altKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;
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
                setInput(input + 1);
        }
    };

    const enter = () => {
        setInput(0);
    };

    const backspace = () => {
        if (terminal.buffer.active.cursorX >= 10) {
            terminal.write('\x1B[0J');
            setInput(input - 1);
        }
    };

    const moveRight = () => {
        const isEnd = terminal.buffer.active.cursorX - 10 <= input;
        console.log(terminal.buffer.active.cursorX, input);

        if (!isEnd) {
            terminal.write('\x1B[C');
        }
    };

    const moveLeft = () => {
        const isStart = terminal.buffer.active.cursorX >= 10 + input;
        console.log(terminal.buffer.active.cursorX, input);

        if (!isStart) {
            terminal.write('\x1B[D');
        }
    };

    return <div id="terminal" />;
};
export default Body;
