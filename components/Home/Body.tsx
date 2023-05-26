import Link from 'next/link';
import { useQuery } from 'react-query';

import { getPosts } from 'api/post';
import { Post } from 'types/post';

type PropTypes = {
    posts: Post[];
};

const Body = ({ posts }: PropTypes) => {
    const { data } = useQuery('post', getPosts, {
        initialData: posts,
    });

    return (
        <ol>
            {data &&
                data
                    .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
                    .map((post, id) => {
                        const date = new Date(post.CreatedAt).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                        });
                        return (
                            <li key={id} className="mb-16">
                                <h1 className="mb-2 text-2xl font-bold">
                                    <Link href={`post/${post.SK}`} className="text-inherit">
                                        <p>{post.Title}</p>
                                    </Link>
                                </h1>
                                <p className="mb-2 opacity-60">{date}</p>
                            </li>
                        );
                    })}
        </ol>
    );
};

export default Body;
