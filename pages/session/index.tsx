import { createSession, deleteSession, getSessions } from 'api/session';
import Session from 'components/Session';
import { useEffect, useState } from 'react';
import { DeleteSessionRequest, SessionType } from 'types/session';

const SessionPage = () => {
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState<SessionType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const host = '192.168.117.3';
    const port = 32000;
    const redirect = `/vnc?autoconnect=ture&host=${host}&port=${port}&path=?token=`;

    const onCreateSession = async () => {
        createSession({ name: 'test' })
            .then((res) => {
                const { name, sessionId } = res;

                const newSession: SessionType = {
                    id: sessionId,
                    name,
                    href: redirect + sessionId,
                };
                setSessions((prev) => [newSession, ...prev]);
            })
            .catch((e) => {
                const errorData = e.response?.data;
                switch (errorData.code) {
                    case 'SESSION_LIMIT':
                        setErrorMessage(errorData.message);
                        break;
                }
            });
    };

    const onDeleteSession = async (data: DeleteSessionRequest) => {
        deleteSession(data)
            .then((res) => {
                console.log(res);
                setSessions((prev) => prev.filter((s) => s.id !== data.sessionId));
            })
            .catch(() => {
                setErrorMessage('cannot delete session');
            });
    };

    useEffect(() => {
        setLoading(true);

        getSessions()
            .then((res) => {
                const sessions: SessionType[] = res.map((s) => ({
                    id: s.sessionId,
                    name: s.name,
                    href: redirect + s.sessionId,
                }));
                setSessions(sessions);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Session
            loading={loading}
            errorMessage={errorMessage}
            sessions={sessions}
            onCreateSession={onCreateSession}
            onDeleteSession={onDeleteSession}
        />
    );
};

export default SessionPage;
