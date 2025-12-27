import { getChat } from 'api/chat';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChatType } from 'types/chat';
import dayjs from 'dayjs';
import { io } from 'socket.io-client';

import ChatSvg from 'public/icons/chat.svg';

const socket = io(
    process.env.NODE_ENV === 'production' ? `${process.env.CHAT_API_URL}` : 'https://sub.redundant4u.com/chat',
    {
        transports: ['websocket'],
        path: '/ws/chat',
    }
);

const Chat = () => {
    const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
    const [chatInput, setChatInput] = useState<string>('');
    const [chats, setChats] = useState<ChatType[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const chatRef = useRef<HTMLDivElement | null>(null);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const loadChat = async () => {
            const data = (await getChat())['data'];
            setChats(data);
        };
        loadChat();

        socket.on('connect', () => setIsSocketConnected(true));
        socket.on('disconnect', () => setIsSocketConnected(false));
        socket.on('chat', (chat: ChatType) => setChats((chats) => [...chats, chat]));
        // socket.on('error', (e: string) => ());
    }, []);

    useEffect(() => {
        if (isSocketConnected && isOpen && chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [isSocketConnected, isOpen, chats]);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setChatInput(e.target.value);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (chatInput && e.key == 'Enter') {
            socket.emit('create', chatInput);
            setChatInput('');
        }
    };

    return (
        <div>
            {!isOpen ? (
                <div className="fixed bottom-4 right-4 rounded-full bg-slate-600 p-3">
                    <ChatSvg width={28} height={28} fill="#FFFFFF" onClick={toggle} />
                </div>
            ) : (
                <div className="flex flex-col fixed bottom-4 right-4 left-4 sm:left-auto bg-white dark:bg-slate-800 border border-gray-300 rounded-lg overflow-hidden w-auto sm:w-[24rem] h-[28rem] sm:h-[32rem]">
                    <div className="pt-3 pr-4 pb-3 text-right">
                        <button onClick={toggle}>✕</button>
                    </div>
                    {isSocketConnected ? (
                        <>
                            <div
                                className="flex flex-col space-y-4 p-4 overflow-auto h-[calc(100%-4rem)]"
                                ref={chatRef}
                            >
                                {chats.map((chat, i) => (
                                    <ul key={`chat${i}`}>
                                        <p className="rounded-lg bg-gray-300 dark:bg-gray-500 p-2">{chat.content}</p>
                                        <div className="flex flex-row-reverse opacity-60 text-sm space-x-2 space-x-reverse">
                                            <p>{dayjs(chat.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                                            <p>anony</p>
                                        </div>
                                    </ul>
                                ))}
                            </div>
                            <div className="p-2 border-t border-gray-300">
                                <input
                                    type="text"
                                    className="w-full h-8 p-2 border border-gray-400 rounded-lg text-black"
                                    value={chatInput}
                                    onChange={onChange}
                                    onKeyDown={onKeyDown}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center">Waiting...</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Chat;
