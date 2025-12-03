import dynamic from 'next/dynamic';

const VncPage = dynamic(() => import('../../components/Vnc'), {
    ssr: false,
});

export default VncPage;
