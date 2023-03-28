import Link from 'next/link';
import rehypeRaw from 'rehype-raw';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/default-highlight';
import { useQuery } from 'react-query';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { useEffect, useState } from 'react';

import CommonHeader from 'components/Common/Header';
import { Post } from 'types/post';
import { getPost } from 'api/post';

type PropTypes = {
    postId: string;
    post: Post;
};

const PostPage = ({ postId, post }: PropTypes) => {
    const { data } = useQuery(['post', post], async () => getPost(postId), {
        initialData: post,
    });
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
            setIsDarkMode(event.matches);
        });
    }, []);

    if (!data) {
        return <div />;
    }

    return (
        <div>
            <CommonHeader />
            <article className="pt-8 pr-4 pl-4 mt-0 mb-0 mr-auto ml-auto text-justify max-w-[800px]">
                <h1 className="text-3xl font-extrabold pb-16">
                    <span>{data.title}</span>
                </h1>
                <section>
                    <ReactMarkdown
                        className="prose dark:prose-invert max-w-[800px]"
                        children={data.content}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            code({ children, className, inline }) {
                                return inline ? (
                                    <code className="p-1 rounded bg-[#f2f2f2] font-mono dark:bg-[#0f081c]">
                                        {children}
                                    </code>
                                ) : (
                                    <SyntaxHighlighter
                                        style={isDarkMode ? atomOneDarkReasonable : undefined}
                                        children={children[0]?.toString() || ''}
                                        language={className || 'text'}
                                        customStyle={{
                                            padding: 24,
                                            marginTop: 24,
                                            marginBottom: 24,
                                            borderRadius: 12,
                                            lineHeight: 1.7,
                                            overflow: 'auto',
                                        }}
                                    />
                                );
                            },
                        }}
                    />
                    <Link href="/" className="mt-12 mb-12 block">
                        ← 돌아가기
                    </Link>
                </section>
            </article>
        </div>
    );
};

export default PostPage;
