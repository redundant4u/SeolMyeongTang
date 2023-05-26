import dynamic from 'next/dynamic';

const Me = dynamic(() => import('../../components/Me'), { ssr: false });

const MePage = () => {
    return <Me />;
};

export default MePage;
