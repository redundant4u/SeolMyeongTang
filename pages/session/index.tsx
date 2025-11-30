import { createSession, getSessions } from 'api/session';
import Session from 'components/Session';
import { useEffect, useState } from 'react';
import { SessionType } from 'types/session';

const SessionPage = () => {
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState<SessionType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const host = '192.168.117.3';
    const port = 32000;
    const redirect = `/vnc/vnc_lite.html?autoconnect=ture&host=${host}&port=${port}&path=?token=vnc-`;

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
        <Session loading={loading} errorMessage={errorMessage} sessions={sessions} onCreateSession={onCreateSession} />
    );
};

export default SessionPage;
