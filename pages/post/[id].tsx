import { getBlocks, getDatabase, getPage } from 'api/notion';
import type { GetStaticPaths, GetStaticProps } from 'next';
import { Block } from 'types/notion';

import PostPage from 'components/Post';

type PropTypes = {
    id: string;
    title: string;
    blocks: Block[];
};

const Post = ({ id, title, blocks }: PropTypes) => {
    return (
        <>
            <PostPage id={id} title={title} blocks={blocks} />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { results } = await getDatabase();
    const paths = results.map((page) => ({ params: { id: page.id } }));

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id;

    if (id?.length != 36 || Array.isArray(id)) {
        return {
            notFound: true,
        };
    }

    const page = await getPage(id);
    const blocks = await getBlocks(id);

    const title = page.properties.Name.title[0].plain_text;

    return {
        props: { id, title, blocks },
        revalidate: 1,
    };
};

export default Post;
