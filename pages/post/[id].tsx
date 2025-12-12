import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import PostPage from 'components/Post';
import { getPost, getPosts } from 'api/post';
import { PostType } from 'types/post';

type PropTypes = {
    post: PostType;
};

const Post = ({ post }: PropTypes) => {
    const { Title: title } = post;
    const postId = post.SK;

    const titleConent = `${title} | 설명탕`;
    const urlContent = `https://redundant4u.com/post/${postId}`;

    return (
        <>
            <Head>
                <title>{titleConent}</title>
                <meta property="og:title" content={titleConent} />
                <meta property="og:url" content={urlContent} />
            </Head>
            <PostPage post={post} />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await getPosts();
    const paths = posts.map((post) => ({ params: { id: post.SK } }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const postId = context.params?.id;

    if (!postId || Array.isArray(postId)) {
        return {
            notFound: true,
        };
    }

    const post = await getPost(postId);

    return {
        props: { post },
    };
};

export default Post;
