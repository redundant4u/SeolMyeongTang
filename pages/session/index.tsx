'use client';

import { createClientId, createSession, deleteSession, getSessions } from 'api/session';
import Session from 'components/Session';
import { useEffect, useState } from 'react';
import { CreateSessionRequest, DeleteSessionRequest, SessionType } from 'types/session';

const SessionPage = () => {
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<SessionType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const host = '192.168.117.2';
    const port = 32000;
    const redirect = `/vnc?autoconnect=ture&host=${host}&port=${port}&path=?token=`;

    const onCreateSession = async (data: CreateSessionRequest) => {
        try {
            let id = clientId;

            if (!id) {
                const { clientId: newClientId } = await createClientId();
                localStorage.setItem('clientId', newClientId);
                id = newClientId;
            }

            const { name, sessionId } = await createSession(id, data);
            const newSession: SessionType = {
                id: sessionId,
                name,
                href: `${redirect}${id}:${sessionId}`,
            };

            setSessions((prev) => [newSession, ...prev]);
        } catch (_) {
            setErrorMessage('failed to create session');
        }
    };

    const onDeleteSession = async (data: DeleteSessionRequest) => {
        if (!clientId) {
            return setErrorMessage('cannot delete session');
        }

        try {
            await deleteSession(clientId, data);
            setSessions((prev) => prev.filter((s) => s.id !== data.sessionId));
        } catch {
            setErrorMessage('cannot delete session');
        }
    };

    useEffect(() => {
        const fetchSessions = async () => {
            if (!clientId) return;

            setLoading(true);

            try {
                const res = await getSessions(clientId);

                const sessions: SessionType[] = res.map((s) => ({
                    id: s.sessionId,
                    name: s.name,
                    href: `${redirect}${clientId}:${s.sessionId}`,
                }));

                setSessions(sessions);
            } catch (_) {
                setErrorMessage('Failed to load sessions');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [clientId]);

    useEffect(() => {
        setClientId(localStorage.getItem('clientId'));
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
