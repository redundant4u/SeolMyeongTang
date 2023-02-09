import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/index.module.css';

const MainHeader = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logos}>
                <Image src="/logo.jpeg" alt="logo" width={160} height={160} />
            </div>
            <h1>설명탕</h1>
            <p>
                안녕하세요 ‘<strong>설명탕</strong>’입니다.
                <br />
                <br />
                설명탕은 공유하고 싶은 컴퓨터 관련 글 또는 영상을 요약하여 전달하거나,
                <br />
                소개하고 싶은 저의 경험을 여러분들한테 전달합니다.
                <br />
                <br />
                설명탕의 목표는 컴퓨터와 개발에 관심 있는 분들을 대상으로 IT 소식을 접할 수 있도록 합니다.
                <br />
                설명탕을 통해 미약하지만 자료를 얻고 도움이 되었으면 하는 바람입니다.
                <br />
                <br />
                <Link href="https://redundant4u.notion.site/92de3eb204904963bf029e5c149b68ed">노션</Link>에서도 해당
                내용을 볼 수 있습니다.
                <br />
                <br />
                피드백은 언제든 환영입니다.
                <br />
                <br />
                아래의 이메일로 연락주시면 감사하겠습니다.
                <br />
                physiogel@pusan.ac.kr
            </p>
            <h2 className={styles.heading}>목록</h2>
        </header>
    );
};
export default MainHeader;
