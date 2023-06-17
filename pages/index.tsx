import { GetStaticProps, NextPage } from 'next';

import { Home } from 'components';
import { getPosts } from 'api/post';
import { Post } from 'types/post';

type PropTypes = {
    posts: Post[];
};

const HomePage: NextPage = ({ posts }: PropTypes) => {
    return (
        <>
            <Home posts={posts} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const posts = await getPosts();

    return {
        props: { posts },
    };
};

export default HomePage;
