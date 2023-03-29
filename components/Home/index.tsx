import Header from './Header';
import Body from './Body';

import { Posts } from 'types/post';
import Head from 'next/head';

type PropTypes = {
    posts: Posts;
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
