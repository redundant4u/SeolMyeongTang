import { getBlocks } from 'api/notion';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import styles from 'styles/post.module.css';

import Text from 'components/Text';

import { Block, BlockValue } from 'types/notion';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

type PropTypes = {
    id: string;
    title: string;
    blocks: Block[];
};

const PostPage = ({ id, title, blocks }: PropTypes) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            setIsDarkMode(event.matches);
        });
    }, []);

    const { data } = useQuery(['blocks', id], async () => getBlocks(id), {
        initialData: blocks,
    });

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
                const code = value.rich_text[0].plain_text;

                return (
                    <SyntaxHighlighter
                        className={styles.highlighter}
                        customStyle={{ padding: 24 }}
                        language={value.language}
                        style={isDarkMode ? atomOneDarkReasonable : undefined}
                    >
                        {code}
                    </SyntaxHighlighter>
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
                    <Link href={href ?? ''} target="_blank" className={styles.bookmark}>
                        {href}
                    </Link>
                );
            case 'callout':
                const title = `${value.icon?.emoji} ${value.rich_text[0].plain_text}`;
                const children = block.children !== null ? renderNestedList(block.children) : '';
                const text = `${title}\n${children}`;

                return (
                    <SyntaxHighlighter
                        className={styles.highlighter}
                        customStyle={{ padding: 24 }}
                        wrapLongLines={true}
                        language="plaintext"
                        style={isDarkMode ? atomOneDarkReasonable : undefined}
                    >
                        {text}
                    </SyntaxHighlighter>
                );
            default:
                return `❌ Unsupported block (${type === 'unsupported' ? 'unsupported by Notion API' : type})`;
        }
    };

    const renderNestedList = (blocks: Block[] | null) => {
        if (!blocks) {
            return null;
        }

        return blocks.map((block) => {
            const { type } = block;
            const value = block[type] as BlockValue;

            const isNumberedList = value.type === 'numbered_list_item';
            if (isNumberedList) {
                return <ol key={block.id}>{renderBlock(block)}</ol>;
            }
            return <ul key={block.id}>{renderBlock(block)}</ul>;
        });
    };

    if (!data) {
        return <div />;
    }

    return (
        <div>
            <article className={styles.container}>
                <h1 className={styles.name}>
                    <span>{title}</span>
                </h1>
                <section>
                    {data.map((block) => (
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

export default PostPage;
