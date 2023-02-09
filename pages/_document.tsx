import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = () => {
    return (
        <Html lang="ko">
            <Head>
                <meta charSet="utf-8" />

                <meta name="robots" content="index, follow" />

                <meta property="og:type" content="website" />
                <meta property="og:title" content="SeolMyeongTang 설명탕" />
                <meta
                    property="og:description"
                    content="설명탕은 공유하고 싶은 컴퓨터 관련 글 또는 영상을 요약하여 전달하거나, 소개하고 싶은 저의 경험을 여러분들한테 전달합니다."
                />
                <meta property="og:image" content="https://redundant4u.com/logo.jpeg" />
                <meta property="og:url" content="https://redundant4u.com" />

                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default MyDocument;
