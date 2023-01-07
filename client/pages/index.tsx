import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/index.module.css';

export const databaseId = process.env.NOTION_DATABASE_ID ?? '';

export default function Home({ posts }) {
    return (
        <div>
            <Head>
                <title>Notion Next.js blog</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.logos}>
                        <Image src="/logo.jpeg" alt="logo" width={160} height={160} />
                    </div>
                    <h1>설명탕</h1>
                    <p>
                        안녕하세요 ‘<strong>설명탕</strong>’입니다.
                        <br />
                        <br />
                        설명탕의 목표는 컴퓨터와 개발에 관심 있는 분들을 대상으로 쉽게 IT 소식을 접할 수 있도록 합니다.
                        <br />
                        설명탕은 공유하고 싶은 글 또는 영상을 요약하여 전달하거나, 소개하고 싶은 저의 경험을
                        여러분들한테 전달합니다.
                        <br />
                        설명탕을 통해 미약하지만 자료를 얻고 도움이 되었으면 하는 바람입니다.
                        <br />
                        <br />
                        피드백은 언제든 환영입니다.
                        <br />
                        <br />
                        아래의 이메일로 연락주시면 감사하겠습니다.
                        <br />
                        physiogel@pusan.ac.kr
                    </p>
                </header>

                <h2 className={styles.heading}>All Posts</h2>
                <ol className={styles.posts}>
                    {posts.map((post) => {
                        const date = new Date(post.last_edited_time).toLocaleString('ko-KR', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                        });
                        return (
                            <li key={post.id} className={styles.post}>
                                <h3 className={styles.postTitle}>
                                    <Link href={`/${post.id}`}></Link>
                                </h3>
                                <p className={styles.postDescription}>{date}</p>
                                <Link href={`/${post.id}`}>Read post →</Link>
                            </li>
                        );
                    })}
                </ol>
            </main>
        </div>
    );
}

export const getStaticProps = async () => {
    return {
        props: {
            posts: [],
        },
    };
};
