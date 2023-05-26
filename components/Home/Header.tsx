import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="leading-normal">
            <div className="flex pt-12 pb-8">
                <Image src="/logo.jpeg" alt="logo" width={160} height={160} />
            </div>
            <h1 className="font-extrabold text-4xl mb-8">설명탕</h1>
            <div className="opacity-70">
                <p>
                    안녕하세요 ‘<strong>설명탕</strong>’입니다.
                </p>
                <br />
                <p>
                    설명탕은 공유하고 싶은 컴퓨터 관련 글 또는 영상을 요약하여 전달하거나, 소개하고 싶은 저의 경험을
                    여러분들한테 전달합니다.
                </p>
                <br />
                <p>
                    설명탕의 목표는 컴퓨터와 개발에 관심 있는 분들을 대상으로 컴퓨터 관련 소식을 접할 수 있도록 합니다.
                </p>
                <br />
                <p>설명탕을 통해 미약하지만 자료를 얻고 도움이 되었으면 하는 바람입니다.</p>
                <br />
                <p>피드백은 언제든 환영입니다.</p>
                <p>
                    <a href="mailto:physiogel@pusan.ac.kr">physiogel@pusan.ac.kr</a>
                </p>
            </div>
            <li className="flex mt-16 mb-6 pb-2 space-x-4 border-b dark:border-[#343539] font-bold">
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
            </li>
        </header>
    );
};
export default Header;
