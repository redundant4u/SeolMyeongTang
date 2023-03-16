import { getBlocks, getDatabase, getPage } from 'api/notion';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Block } from 'types/notion';

import PostPage from 'components/Post';
import Head from 'next/head';
import { postIds } from 'consts/postIds';

type PropTypes = {
    pageId: string;
    title: string;
    blocks: Block[];
};

const Post = ({ pageId, title, blocks }: PropTypes) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
            </Head>
            <PostPage pageId={pageId} title={title} blocks={blocks} />
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

    if (!id || Array.isArray(id)) {
        return {
            notFound: true,
        };
    }

    const pageId = Object.keys(postIds).find((key) => postIds[key] === id);

    if (!pageId) {
        return {
            notFound: true,
        };
    }

    const page = await getPage(pageId);
    const blocks = await getBlocks(pageId);

    const title = page.properties.Name.title[0].plain_text;

    return {
        props: { pageId, title, blocks },
        revalidate: 1,
    };
};

export default Post;
