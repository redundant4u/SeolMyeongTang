import Header from './Header';
import Body from './Body';

import Head from 'next/head';
import { Post } from 'types/post';

type PropTypes = {
    posts: Post[];
};

const Home = ({ posts }: PropTypes) => {
    return (
        <>
            <Head>
                <title>SeolMyeongTang 설명탕</title>
                <meta property="og:title" content="SeolMyeongTang 설명탕" />
            </Head>
            <main className="pr-8 pl-8 max-w-[800px] mt-0 mr-auto mb-0 ml-auto">
                <Header />
                <Body posts={posts} />
            </main>
        </>
    );
};

export default Home;
