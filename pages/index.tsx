import { GetStaticProps, NextPage } from 'next';

import { Home } from 'components';
import { getPosts } from 'api/post';
import { Posts } from 'types/post';

type PropTypes = {
    posts: Posts;
};

const HomePage: NextPage = ({ posts }: PropTypes) => {
    return (
        <>
            <Home posts={posts} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const database = await getPosts();

    return {
        props: { database },
    };
};

export default HomePage;
