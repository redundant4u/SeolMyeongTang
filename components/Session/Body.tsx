import { useRouter } from 'next/router';
import { DeleteSessionRequest, SessionType } from 'types/session';

type PropTypes = {
    loading: boolean;
    errorMessage: string | null;
    sessions: SessionType[];
    onCreateSession: () => void;
    onDeleteSession: (data: DeleteSessionRequest) => void;
};

const SessionBody = ({ loading, errorMessage, sessions, onCreateSession, onDeleteSession }: PropTypes) => {
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
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Environments</h2>
                    <p className="text-xs text-slate-400 mt-1">Create a new workspace or join an existing session.</p>
                    {errorMessage && <p className="text-xs text-red-500 mt-2">{errorMessage}</p>}
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 active:scale-[0.97] transition"
                    onClick={onCreateSession}
                >
                    <span
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 border border-white/30
                                   text-base leading-none"
                    >
                        +
                    </span>
                    <span>Create Environment</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((s) => (
                    <div key={s.id} onClick={() => onRedirectToVNC(s.href)} className="group cursor-pointer">
                        <div
                            className="h-40 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 flex flex-col justify-between shadow-sm transition
                            hover:border-blue-500 hover:shadow-md hover:bg-blue-50"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">
                                        {s.name}
                                    </span>
                                    <span className="text-xs text-slate-400 mt-1">High performance workspace</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={(e) => onDeleteSessionClick(e, s.id)}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed
                                    bg-slate-50 text-slate-400 text-2xl leading-none transition-colors
                                    group-hover:border-blue-400 group-hover:text-blue-500 group-hover:bg-white
                                    hover:!border-red-400 hover:!text-red-500 hover:!bg-red-50"
                                >
                                    -
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span>VNC lite</span>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                                    {loading ? 'Creating' : 'Running'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionBody;
