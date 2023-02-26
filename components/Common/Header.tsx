import Link from 'next/link';

const CommonHeader = () => {
    return (
        <header className="p-4">
            <Link href="/">
                <li className="flex space-x-2">
                    <ul>
                        <img src="/logo.jpeg" alt="logo" width={28} height={28} />
                    </ul>
                    <ul>
                        <p className="font-extrabold text-lg text-black dark:text-white">SeolMyeongTang</p>
                    </ul>
                </li>
            </Link>
        </header>
    );
};
export default CommonHeader;
