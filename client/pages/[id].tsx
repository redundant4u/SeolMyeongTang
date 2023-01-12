import { getBlocks, getDatabase, getPage } from 'api/notion';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment } from 'react';
import { BlockValue, Block, Page } from 'types/notion';
import styles from '../styles/post.module.css';
import Text from './text';

type PropTypes = {
    page: Page | null;
    blocks: Block[];
};

const Post = ({ page, blocks }: PropTypes) => {
    const renderNestedList = (blocks: Block[] | null) => {
        if (!blocks) {
            return null;
        }

        return blocks.map((block) => {
            const { type } = block;
            const value = block[type] as BlockValue;

            const isNumberedList = value.type === 'numbered_list_item';
            if (isNumberedList) {
                return <ol>{renderBlock(block)}</ol>;
            }
            return <ul>{renderBlock(block)}</ul>;
        });
    };

    const renderBlock = (block: Block) => {
        const { type, id, has_children } = block;
        const value = block[type] as BlockValue;

        switch (type) {
            case 'paragraph':
                return (
                    <p>
                        <Text text={value.rich_text} />
                    </p>
                );
            case 'heading_1':
                return (
                    <h1>
                        <Text text={value.rich_text} />
                    </h1>
                );
            case 'heading_2':
                return (
                    <h2>
                        <Text text={value.rich_text} />
                    </h2>
                );
            case 'heading_3':
                return (
                    <h3>
                        <Text text={value.rich_text} />
                    </h3>
                );
            case 'bulleted_list_item':
            case 'numbered_list_item':
                return (
                    <li>
                        <Text text={value.rich_text} />
                        {has_children && renderNestedList(block.children)}
                    </li>
                );
            case 'to_do':
                return (
                    <div>
                        <label htmlFor={id}>
                            <input type="checkbox" id={id} defaultChecked={value.checked} />{' '}
                            <Text text={value.rich_text} />
                        </label>
                    </div>
                );
            case 'toggle':
                return (
                    <details>
                        <summary>
                            <Text text={value.rich_text} />
                        </summary>
                        {value.children?.map((block) => (
                            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                        ))}
                    </details>
                );
            case 'child_page':
                return <p>{value.title}</p>;
            case 'image':
                const src = (value.external?.url ?? value.file?.url) || 'ERROR';
                const caption = value.caption ? value.caption[0]?.plain_text : '';
                return (
                    <figure>
                        <img src={src} alt={caption} />
                        {caption && <figcaption>{caption}</figcaption>}
                    </figure>
                );
            case 'divider':
                return <hr key={id} />;
            case 'quote':
                return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
            case 'code':
                return (
                    <pre className={styles.pre}>
                        <code className={styles.code_block} key={id}>
                            {value.rich_text[0].plain_text}
                        </code>
                    </pre>
                );
            case 'file':
                const srcFile = (value.external?.url ?? value.file?.url) || 'ERROR';
                const splitSourceArray = srcFile.split('/');
                const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
                const captionFile = value.caption ? value.caption[0]?.plain_text : '';

                return (
                    <figure>
                        <div className={styles.file}>
                            📎{' '}
                            <Link href={srcFile} passHref>
                                {lastElementInArray.split('?')[0]}
                            </Link>
                        </div>
                        {captionFile && <figcaption>{captionFile}</figcaption>}
                    </figure>
                );
            case 'bookmark':
                const href = value.url;
                return (
                    <a href={href} target="_brank" className={styles.bookmark}>
                        {href}
                    </a>
                );
            default:
                return `❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`;
        }
    };

    if (!page || !blocks) {
        return <div />;
    }

    return (
        <div>
            <Head>
                <title>{page.properties.Name.title[0].plain_text}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <article className={styles.container}>
                <h1 className={styles.name}>
                    <Text text={page.properties.Name.title} />
                </h1>
                <section>
                    {blocks.map((block) => (
                        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                    ))}
                    <Link href="/" className={styles.back}>
                        ← Go home
                    </Link>
                </section>
            </article>
        </div>
    );
};

export const getStaticPaths = async () => {
    const database = await getDatabase();

    return {
        paths: database.map((page) => ({ params: { id: page.id } })),
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async (context) => {
    const id = context.params?.id?.toString() || 'ERROR';

    const page = await getPage(id);
    const blocks = await getBlocks(id);
    const childBlocks = await Promise.all(
        blocks
            .filter((block) => block.has_children)
            .map(async (block) => {
                return {
                    id: block.id,
                    children: await getBlocks(block.id),
                };
            })
    );

    const blocksWithChildren = blocks.map((block) => {
        const childBlock = childBlocks
            .filter((childBlock) => childBlock.id === block.id)
            .map((childBlock) => childBlock.children)[0];

        block.children = childBlock || null;
        return block;
    });

    return {
        props: {
            page,
            blocks: blocksWithChildren,
        },
        revalidate: 1,
    };
};

export default Post;
