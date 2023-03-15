import { getDatabase } from 'api/notion';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Text from 'components/Text';
import { Database } from 'types/notion';
import { postIds } from 'consts/postIds';

type PropTypes = {
    database: Database;
};

const Body = ({ database }: PropTypes) => {
    const { data } = useQuery('notion', getDatabase, {
        initialData: database,
    });

    return (
        <ol>
            {data &&
                data.results
                    .sort(
                        (a, b) =>
                            new Date(b.properties.Created_at.date.start).getTime() -
                            new Date(a.properties.Created_at.date.start).getTime()
                    )
                    .map((post) => {
                        const date = new Date(post.properties.Created_at.date.start).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                        });
                        return (
                            <li key={post.id} className="mb-16">
                                <h1 className="mb-2 text-2xl font-bold">
                                    <Link
                                        href={`post/${post.id}`}
                                        as={`post/${postIds[post.id]}`}
                                        className="text-inherit"
                                    >
                                        <Text text={post.properties.Name.title} />
                                    </Link>
                                </h1>
                                <p className="mb-2 opacity-60">{date}</p>
                                <Link href={`post/${post.id}`}>더 보기 →</Link>
                            </li>
                        );
                    })}
        </ol>
    );
};

export default Body;
