import CommonFooter from 'components/Common/Footer';
import SessionHeader from './Header';
import SessionBody from './Body';
import { DeleteSessionRequest, SessionType } from 'types/session';

type PropTypes = {
    loading: boolean;
    errorMessage: string | null;
    sessions: SessionType[];
    onCreateSession: () => void;
    onDeleteSession: (data: DeleteSessionRequest) => void;
};

const Session = ({ loading, errorMessage, sessions, onCreateSession, onDeleteSession }: PropTypes) => {
    return (
        <>
            <SessionHeader />
            <SessionBody
                loading={loading}
                errorMessage={errorMessage}
                sessions={sessions}
                onCreateSession={onCreateSession}
                onDeleteSession={onDeleteSession}
            />
            <CommonFooter />
        </>
    );
};

export default Session;
