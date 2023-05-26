import Link from 'next/link';
import Image from 'next/image';

const CommonHeader = () => {
    return (
        <header className="pt-8 pb-8 pl-4 md:pl-6 lg:pl-8">
            <Link href="/">
                <li className="flex space-x-2">
                    <ul>
                        <Image src="/logo.jpeg" alt="logo" width={28} height={28} />
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
