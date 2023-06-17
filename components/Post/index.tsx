import rehypeRaw from 'rehype-raw';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';

import CommonHeader from 'components/Common/Header';
import { Post } from 'types/post';
import Code from 'components/Code';
import CommonFooter from 'components/Common/Footer';

type PropTypes = {
    post: Post;
};

const PostPage = ({ post }: PropTypes) => {
    const date = new Date(post.CreatedAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });

    return (
        <div>
            <CommonHeader />
            <article className="pt-8 pr-4 pl-4 mt-0 mb-16 mr-auto ml-auto text-justify max-w-[800px]">
                <div className="pb-12">
                    <h1 className="text-3xl font-extrabold pb-3">
                        <span>{post.Title}</span>
                    </h1>
                    <span className="opacity-60">{date}</span>
                </div>
                <section>
                    <ReactMarkdown
                        className="prose dark:prose-invert max-w-[800px]"
                        children={post.Content}
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ children, className, inline }) {
                                const code = children[0]?.toString();
                                const language = className ? className.replace('language-', '') : 'TEXT';

                                return inline ? (
                                    <code className="p-1 rounded bg-[#f2f2f2] font-mono dark:bg-[#0f081c]">
                                        {children}
                                    </code>
                                ) : (
                                    <Code code={code || ''} language={language} />
                                );
                            },
                            table({ children }) {
                                return (
                                    <div className="overflow-x-auto whitespace-pre">
                                        <table>{children}</table>
                                    </div>
                                );
                            },
                        }}
                    />
                </section>
            </article>
            <CommonFooter />
        </div>
    );
};

export default PostPage;
