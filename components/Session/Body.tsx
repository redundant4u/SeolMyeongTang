import { useRouter } from 'next/router';
import { DeleteSessionRequest, SessionType } from 'types/session';
import CountDownTTL from './CountDownTTL';
import { useState } from 'react';

type PropTypes = {
    loading: boolean;
    errorMessage: string | null;
    sessions: SessionType[];
    onModalOpen: () => void;
    onDeleteSession: (data: DeleteSessionRequest) => void;
};

const SessionBody = ({ loading, errorMessage, sessions, onModalOpen, onDeleteSession }: PropTypes) => {
    const [isExpired, setIsExpired] = useState(false);

    const router = useRouter();

    const onRedirectToVNC = (href: string) => {
        router.push(href);
    };

    const onDeleteSessionClick = (e, sessionId: string) => {
        e.preventDefault();
        e.stopPropagation();
        onDeleteSession({ sessionId });
    };

    return (
        <div className="w-full px-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Sessions</h2>
                    <p className="text-xs text-slate-400 mt-1">Create a new workspace or join an existing session.</p>
                    {errorMessage && <p className="text-xs text-red-500 mt-2">{errorMessage}</p>}
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:scale-[0.97] transition"
                    onClick={onModalOpen}
                >
                    <span
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 border border-white/30
                                   text-base leading-none"
                    >
                        +
                    </span>
                    <span>Create Session</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((s) => (
                    <div key={s.id}>
                        <div
                            className="relative h-40 rounded-xl border border-slate-200 bg-white px-4 py-3
                flex flex-col justify-between shadow-sm"
                        >
                            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => onDeleteSessionClick(e, s.id)}
                                    title="Delete session"
                                    className="flex h-10 w-10 items-center justify-center rounded-full
                        border border-dashed bg-slate-50 text-slate-400 text-2xl transition-colors
                        hover:!border-red-400 hover:!text-red-500 hover:!bg-red-50"
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onRedirectToVNC(s.href)}
                                    title="Connect"
                                    className="flex h-10 w-10 items-center justify-center rounded-full
                        border bg-slate-50 text-slate-400 text-base transition-colors
                        hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
                                >
                                    →
                                </button>
                            </div>
                            <div className="pr-24">
                                <span className="text-base font-medium text-slate-700">{s.name}</span>

                                {s.description && (
                                    <span className="mt-1 block text-base text-slate-400 line-clamp-2">
                                        {s.description}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-2 font-mono">
                                    <span>ID: {s.id}</span>
                                    <span>/ {s.image}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CountDownTTL ttl={s.ttl} onExpired={() => setIsExpired(true)} />
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 uppercase">
                                        {isExpired ? 'Expired' : loading ? 'Creating' : 'Running'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionBody;
