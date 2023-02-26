import { getBlocks } from 'api/notion';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import Text from 'components/Text';
import CommonHeader from 'components/Common/Header';

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
                    <p className="indent-2 mt-5 mb-4">
                        <Text text={value.rich_text} />
                    </p>
                );
            case 'heading_1':
                return (
                    <h1 className="pt-8 pb-8">
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
                    <li className="mt-2 ml-6">
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
                return renderCaption(value);
            case 'divider':
                return <hr key={id} />;
            case 'quote':
                return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
            case 'code':
                const code = value.rich_text[0].plain_text;

                return (
                    <SyntaxHighlighter
                        customStyle={{
                            padding: 24,
                            marginTop: 24,
                            marginBottom: 24,
                            borderRadius: 12,
                            lineHeight: 1.7,
                            overflow: 'auto',
                        }}
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
                        <div className="pt-2 pr-2 no-underline">
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
                    <>
                        참고:
                        <Link href={href ?? ''} target="_blank" className="">
                            {href}
                        </Link>
                    </>
                );
            case 'callout':
                const title = `${value.icon?.emoji} ${value.rich_text[0].plain_text}`;
                const children = block.children !== null ? renderNestedList(block.children) : '';
                const text = `${title}\n${children}`;

                return (
                    <SyntaxHighlighter
                        customStyle={{
                            padding: 24,
                            marginTop: 24,
                            marginBottom: 24,
                            borderRadius: 12,
                            lineHeight: 1.7,
                            overflow: 'auto',
                        }}
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
            return (
                <ul key={block.id} className="pl-2">
                    {renderBlock(block)}
                </ul>
            );
        });
    };

    const renderCaption = (value: BlockValue) => {
        const src = (value.external?.url ?? value.file?.url) || 'ERROR';
        const { caption } = value;

        const alt = caption ? caption[0]?.plain_text : '';

        return (
            <figure className="mt-8 mr-0 mb-8 ml-0">
                <img src={src} alt={alt} className="w-4/5 block mt-auto mr-auto mb-4 ml-auto" />
                <figcaption className="opacity-50 text-center text-sm">
                    {caption.map((caption, i) =>
                        caption.href ? (
                            <Link href={caption.href} key={i}>
                                {caption.plain_text}
                            </Link>
                        ) : (
                            caption.plain_text
                        )
                    )}
                </figcaption>
            </figure>
        );
    };

    if (!data) {
        return <div />;
    }

    return (
        <div>
            <CommonHeader />
            <article className="pt-12 pr-4 pl-4 mt-0 mr-auto mb-0 ml-auto max-w-[800px] text-justify">
                <h1 className="text-3xl font-extrabold ">
                    <span>{title}</span>
                </h1>
                <section>
                    {data.map((block) => (
                        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                    ))}
                    <Link href="/" className="mt-8 mb-8 block">
                        ← 돌아가기
                    </Link>
                </section>
            </article>
        </div>
    );
};

export default PostPage;
