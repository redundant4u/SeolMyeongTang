import Header from './Header';
import Body from './Body';
import CommonFooter from 'components/Common/Footer';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Post } from 'types/post';

type PropTypes = {
    posts: Post[];
};

const Home = ({ posts }: PropTypes) => {
    const router = useRouter();

    useEffect(() => {
        if ('scrollRestoration' in history && history.scrollRestoration !== 'manual') {
            history.scrollRestoration = 'manual';
        }
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            sessionStorage.setItem('scrollPosition', window.scrollY.toString());
        };
        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    useEffect(() => {
        if ('scrollPosition' in sessionStorage) {
            window.scrollTo(0, Number(sessionStorage.getItem('scrollPosition')));
            sessionStorage.removeItem('scrollPosition');
        }
    }, []);

    return (
        <>
            <Head>
                <title>SeolMyeongTang 설명탕</title>
                <meta property="og:title" content="SeolMyeongTang 설명탕" />
                <meta property="og:url" content="https://redundant4u.com" />
            </Head>
            <main className="pr-8 pl-8 max-w-[850px] mt-0 mr-auto mb-0 ml-auto">
                <Header />
                <Body posts={posts} />
            </main>
            <CommonFooter />
        </>
    );
};

export default Home;
