import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import PostPage from 'components/Post';
import { getPost, getPosts } from 'api/post';
import { Post } from 'types/post';

type PropTypes = {
    postId: string;
    post: Post;
};

const Post = ({ postId, post }: PropTypes) => {
    const { Title: title } = post;

    const titleConent = `${title} | 설명탕`;
    const urlContent = `https://redundant4u.com/post/${postId}`;

    return (
        <>
            <Head>
                <title>{titleConent}</title>
                <meta property="og:title" content={titleConent} />
                <meta property="og:url" content={urlContent} />
            </Head>
            <PostPage postId={postId} post={post} />
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
        props: { postId, post },
        revalidate: 1,
    };
};

export default Post;
