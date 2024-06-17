import rehypeRaw from 'rehype-raw';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CommonHeader from 'components/Common/Header';
import { Post } from 'types/post';
import Code from 'components/Code';
import CommonFooter from 'components/Common/Footer';
import ImageZoom from 'components/ImageZoom';

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
            <article className="pt-8 pr-4 pl-4 mt-0 mb-16 mr-auto ml-auto text-justify max-w-[850px]">
                <div className="pb-12">
                    <h1 className="text-3xl font-extrabold pb-3">
                        <span>{post.Title}</span>
                    </h1>
                    <span className="opacity-60">{date}</span>
                </div>
                <section>
                    <Markdown
                        className="prose dark:prose-invert max-w-[800px]"
                        children={post.Content}
                        rehypePlugins={[rehypeRaw]}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ children, className }) {
                                const code = children?.toString();
                                const language = className ? className.replace('language-', '') : undefined;

                                return language ? (
                                    <Code code={code || ''} language={language} />
                                ) : (
                                    <code className="p-1 rounded bg-[#f2f2f2] font-mono dark:bg-[#0f081c]">{code}</code>
                                );
                            },
                            table({ children }) {
                                return (
                                    <div className="overflow-x-auto whitespace-pre">
                                        <table>{children}</table>
                                    </div>
                                );
                            },
                            img({ src, alt, width }) {
                                return <ImageZoom src={src} alt={alt} width={width} />;
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
