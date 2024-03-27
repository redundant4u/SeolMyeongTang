import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { PixelEditor } from 'utils/crdt/PixelEditor';

import TrashSVG from 'public/icons/trash.svg';

const Header = () => {
    const socket = io(
        process.env.NODE_ENV === 'production' ? `${process.env.CRDT_SOCKET_URL}` : 'http://localhost:3000/crdt',
        {
            transports: ['websocket'],
        }
    );
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const paletteRef = useRef<HTMLInputElement>(null);

    const clearCanvas = () => socket.emit('clear');
    useEffect(() => {
        const canvas = canvasRef.current;
        const palette = paletteRef.current;

        if (!canvas || !palette) {
            return;
        }

        const artBoard = { w: 64, h: 64 };
        const editor = new PixelEditor(canvas, artBoard);

        editor.onchange = (state) => socket.emit('write', state);
        palette.oninput = () => (editor.color = palette.value.substring(1));

        socket.once('init', (state) => editor.receive(state));
        socket.on('merge', (state) => editor.receive(state));
        socket.on('clear', () => editor.clear());

        return () => {
            editor.onchange = () => null;
            socket.disconnect();
        };
    }, []);

    return (
        <header className="leading-normal">
            <div className="flex pt-12 pb-8">
                <div>
                    <canvas className="bg-white w-64 h-64 border-2 cursor-crosshair touch-none" ref={canvasRef} />
                </div>
                <div className="pl-2 flex flex-col justify-end">
                    <input className="color mb-2 w-6 h-6" ref={paletteRef} type="color" defaultValue="#000000" />
                    <TrashSVG onClick={clearCanvas} className="dark:fill-gray-200" />
                </div>
            </div>
            <h1 className="font-extrabold text-4xl mb-8">설명탕</h1>
            <div className="opacity-70">
                <p>
                    안녕하세요 ‘<strong>설명탕</strong>’입니다.
                </p>
                <br />
                <p>
                    설명탕은 공유하고 싶은 컴퓨터 관련 글 또는 영상을 요약하여 전달하거나, 소개하고 싶은 저의 경험을
                    여러분들한테 전달합니다.
                </p>
                <br />
                <p>
                    설명탕의 목표는 컴퓨터와 개발에 관심 있는 분들을 대상으로 컴퓨터 관련 소식을 접할 수 있도록 합니다.
                </p>
                <br />
                <p>설명탕을 통해 미약하지만 자료를 얻고 도움이 되었으면 하는 바람입니다.</p>
                <br />
                <p>피드백은 언제든 환영입니다.</p>
                <p>
                    <a href="mailto:physiogel@pusan.ac.kr">physiogel@pusan.ac.kr</a>
                </p>
            </div>
        </header>
    );
};
export default Header;
