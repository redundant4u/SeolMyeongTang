import { socket, SocketContext } from 'contexts/socket';
import dynamic from 'next/dynamic';

const About = dynamic(() => import('../../components/About'), { ssr: false });

const AboutPage = () => {
    return (
        <SocketContext.Provider value={socket}>
            <About />
        </SocketContext.Provider>
    );
};

export default AboutPage;
