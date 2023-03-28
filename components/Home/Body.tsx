import Link from 'next/link';
import { useQuery } from 'react-query';

import { Posts } from 'types/post';
import { getPosts } from 'api/post';

type PropTypes = {
    posts: Posts;
};

const Body = ({ posts }: PropTypes) => {
    const { data } = useQuery('post', getPosts, {
        initialData: posts,
    });

    return (
        <ol>
            {data &&
                data.posts
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((post, id) => {
                        const date = new Date(post.createdAt).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                        });
                        return (
                            <li key={id} className="mb-16">
                                <h1 className="mb-2 text-2xl font-bold">
                                    <Link href={`post/${post.link}`} className="text-inherit">
                                        <p>{post.title}</p>
                                    </Link>
                                </h1>
                                <p className="mb-2 opacity-60">{date}</p>
                                <Link href={`post/${post.link}`}>더 보기 →</Link>
                            </li>
                        );
                    })}
        </ol>
    );
};

export default Body;
