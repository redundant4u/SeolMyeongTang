import CommonFooter from 'components/Common/Footer';
import SessionHeader from './Header';
import SessionBody from './Body';
import { CreateSessionRequest, DeleteSessionRequest, SessionType } from 'types/session';
import { useState } from 'react';
import CreateSessionModal from './CreateSessionModal';

type PropTypes = {
    loading: boolean;
    errorMessage: string | null;
    sessions: SessionType[];
    onCreateSession: (data: CreateSessionRequest) => void;
    onDeleteSession: (data: DeleteSessionRequest) => void;
};

const Session = ({ loading, errorMessage, sessions, onCreateSession, onDeleteSession }: PropTypes) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateSession = (data: CreateSessionRequest) => {
        onCreateSession(data);
        setIsModalOpen(false);
    };

    return (
        <>
            <SessionHeader />
            <SessionBody
                loading={loading}
                errorMessage={errorMessage}
                sessions={sessions}
                onModalOpen={() => setIsModalOpen(true)}
                onDeleteSession={onDeleteSession}
            />
            <CreateSessionModal
                isOpen={isModalOpen}
                onModalClose={() => setIsModalOpen(false)}
                onCreateSession={handleCreateSession}
            />
            <CommonFooter />
        </>
    );
};

export default Session;
