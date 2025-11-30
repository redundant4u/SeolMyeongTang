import CommonFooter from 'components/Common/Footer';
import SessionHeader from './Header';
import SessionBody from './Body';
import { SessionType } from 'types/session';

type PropTypes = {
    loading: boolean;
    errorMessage: string | null;
    sessions: SessionType[];
    onCreateSession: () => void;
};

const Session = ({ loading, errorMessage, sessions, onCreateSession }: PropTypes) => {
    return (
        <>
            <SessionHeader />
            <SessionBody
                loading={loading}
                errorMessage={errorMessage}
                sessions={sessions}
                onCreateSession={onCreateSession}
            />
            <CommonFooter />
        </>
    );
};

export default Session;
