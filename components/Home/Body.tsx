import Link from 'next/link';

import { Post } from 'types/post';
import SearchSVG from 'public/icons/search.svg';
import { useState } from 'react';

type PropTypes = {
    posts: Post[];
};

const Body = ({ posts }: PropTypes) => {
    const [postData, setPostData] = useState<Post[]>(posts);
    const [isHidden, setIsHidden] = useState(true);

    const onClick = () => {
        setIsHidden(!isHidden);
    };

    const onChnage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        const filteredData = posts.filter((post) => post.Title.includes(keyword));

        setPostData(filteredData);
    };

    return (
        <>
            <div className="h-8 flex items-center justify-between mt-16 mb-6 pb-4 border-b dark:border-[#343539]">
                <div className="flex space-x-4 font-bold">
                    <ul>
                        <Link href="/">
                            <h2 className="opacity-60">목록</h2>
                        </Link>
                    </ul>
                    <ul>
                        <Link href="/me">
                            <h2 className="opacity-60">소개</h2>
                        </Link>
                    </ul>
                </div>
                <div className="flex items-center space-x-2">
                    <SearchSVG onClick={onClick} className="dark:fill-gray-500" />
                    <ul>
                        <input
                            hidden={isHidden}
                            type="text"
                            id="search"
                            className="pt-1 pr-2.5 pb-1 pl-2.5 max-w-[12rem] rounded-lg bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                            onChange={onChnage}
                        />
                    </ul>
                </div>
            </div>
            <div>
                <ol>
                    {postData &&
                        postData
                            .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime())
                            .map((post, id) => {
                                const date = new Date(post.CreatedAt).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
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
            </div>
        </>
    );
};

export default Body;
