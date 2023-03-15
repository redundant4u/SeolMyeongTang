import { getBlocks, getDatabase, getPage } from 'api/notion';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Block } from 'types/notion';

import PostPage from 'components/Post';
import Head from 'next/head';
import { postIds } from 'consts/postIds';

type PropTypes = {
    id: string;
    title: string;
    blocks: Block[];
};

const Post = ({ id, title, blocks }: PropTypes) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
            </Head>
            <PostPage id={id} title={title} blocks={blocks} />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { results } = await getDatabase();
    const paths = results.map((page) => ({ params: { id: postIds[page.id] } }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id;
    const postId = Object.keys(postIds).find((key) => postIds[key] === id);

    if (!postId) {
        return {
            notFound: true,
        };
    }

    const page = await getPage(postId);
    const blocks = await getBlocks(postId);

    const title = page.properties.Name.title[0].plain_text;

    return {
        props: { id, title, blocks },
        revalidate: 1,
    };
};

export default Post;
