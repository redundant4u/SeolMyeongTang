import CommonHeader from 'components/Common/Header';
import ResponsibilityNotice from './ResponsibilityNotice';
import Notice from './Notice';

const SessionHeader = () => {
    return (
        <>
            <CommonHeader />
            <div className="px-4 pt-8 pb-6">
                <h1 className="font-extrabold text-6xl mb-6">Welcome to NETCOM</h1>
                <Notice />
                <ResponsibilityNotice />
            </div>
        </>
    );
};

export default SessionHeader;
