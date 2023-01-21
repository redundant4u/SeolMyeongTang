import { getDatabase, getPage } from 'api/notion';
import type { GetStaticPaths, GetStaticProps } from 'next';
import PostPage from 'components/Post/PostPage';

type PropTypes = {
    id: string;
    title: string;
};

const Post = ({ id, title }: PropTypes) => {
    return (
        <>
            <PostPage id={id} title={title} />
        </>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const { results } = await getDatabase();

    return {
        paths: results.map((page) => ({ params: { id: page.id } })),
        fallback: true,
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
    const title = page.properties.Name.title[0].plain_text;

    return {
        props: { id, title },
        revalidate: 1,
    };
};

export default Post;
