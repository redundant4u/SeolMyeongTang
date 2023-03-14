import dynamic from 'next/dynamic';

const About = dynamic(() => import('../../components/About'), { ssr: false });

const AboutPage = () => {
    return <About />;
};

export default AboutPage;
