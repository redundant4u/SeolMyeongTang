import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage, { getStaticProps as homeProps } from 'pages/index';
import PostPage, { getStaticPaths, getStaticProps as postProps } from 'pages/post/[id]';
import MePage from 'pages/me';
import VncPage from 'pages/vnc';
import App from 'pages/_app';
import Document from 'pages/_document';
import { getPost, getPosts } from 'api/post';

vi.mock('api/post', () => ({ getPosts: vi.fn(), getPost: vi.fn() }));
vi.mock('components/Home', () => ({ default: ({ posts }) => <p>{posts.map((p) => p.Title).join(',')}</p> }));
vi.mock('components/Post', () => ({ default: ({ post }) => <p>{post.Title}</p> }));
vi.mock('components/Me', () => ({ default: () => <p>terminal route</p> }));
vi.mock('components/Vnc', () => ({ default: () => <p>vnc route</p> }));
vi.mock('next/head', () => ({ default: () => null }));
vi.mock('next/document', () => ({
    Html: ({ children, ...props }) => <html {...props}>{children}</html>,
    Head: ({ children }) => <head>{children}</head>,
    Main: () => <p>document main</p>,
    NextScript: () => <p>document scripts</p>,
}));
vi.mock('next/dynamic', () => ({
    default: (load, options) => {
        expect(options.ssr).toBe(false);
        return function Dynamic() {
            const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
            React.useEffect(() => {
                load().then((module) => setComponent(() => module.default));
            }, []);
            return Component ? <Component /> : null;
        };
    },
}));

const post = { Title: 'Article', SK: 'post1', Content: '', CreatedAt: '2026-01-01', Tags: null };

it('builds static article routes, maps props and rejects missing or array route IDs', async () => {
    vi.mocked(getPosts).mockResolvedValue([post]);
    vi.mocked(getPost).mockResolvedValue(post);
    expect(await homeProps({} as never)).toEqual({ props: { posts: [post] } });
    expect(await getStaticPaths({} as never)).toEqual({ paths: [{ params: { id: 'post1' } }], fallback: false });
    expect(await postProps({ params: { id: 'post1' } } as never)).toEqual({ props: { post } });
    expect(getPost).toHaveBeenCalledWith('post1');
    for (const params of [undefined, {}, { id: ['bad'] }])
        expect(await postProps({ params } as never)).toEqual({ notFound: true });
    const home = render(<HomePage posts={[post]} />);
    expect(screen.getByText('Article')).toBeInTheDocument();
    home.unmount();
    const detail = render(<PostPage post={post} />);
    expect(screen.getByText('Article')).toBeInTheDocument();
    detail.unmount();
    vi.mocked(getPosts).mockRejectedValueOnce(new Error('offline'));
    await expect(homeProps({} as never)).rejects.toThrow('offline');
});

it('renders the application provider, document structure and browser-only routes', async () => {
    const app = render(<App Component={() => <p>app page</p>} pageProps={{}} router={{} as never} />);
    expect(screen.getByText('app page')).toBeInTheDocument();
    app.unmount();
    const doc = renderToStaticMarkup(<Document />);
    expect(doc).toContain('<html lang="ko">');
    expect(doc).toContain('document main');
    expect(doc).toContain('document scripts');
    expect(doc).toContain('name="robots" content="index, follow"');
    const me = render(<MePage />);
    await screen.findByText('terminal route');
    me.unmount();
    render(<VncPage />);
    await screen.findByText('vnc route');
});
