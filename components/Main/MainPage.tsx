import { getDatabase } from 'api/notion';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Text from 'components/Text';
import styles from 'styles/index.module.css';
import { Database } from 'types/notion';

type PropTypes = {
    database: Database;
};

const MainPage = ({ database }: PropTypes) => {
    const { data } = useQuery('notion', getDatabase, {
        initialData: database,
    });

    return (
        <>
            {data &&
                data.results.map((post) => {
                    const date = new Date(post.properties.Created_at.date.start).toLocaleString('ko-KR', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric',
                    });
                    return (
                        <li key={post.id} className={styles.post}>
                            <h3 className={styles.postTitle}>
                                <Link href={`post/${post.id}`}>
                                    <Text text={post.properties.Name.title} />
                                </Link>
                            </h3>
                            <p className={styles.postDescription}>{date}</p>
                            <Link href={`post/${post.id}`}>Read post →</Link>
                        </li>
                    );
                })}
        </>
    );
};

export default MainPage;
