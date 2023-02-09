import type { AppProps } from 'next/app';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/globals.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <Head>
                <title>SeolMyeongTang 설명탕</title>

                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta
                    name="description"
                    content="설명탕은 공유하고 싶은 컴퓨터 관련 글 또는 영상을 요약하여 전달하거나, 소개하고 싶은 저의 경험을 여러분들한테 전달합니다."
                />
                <meta name="keywords" content="SeolMyeongTang, 설명탕, smt" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </>
    );
};

export default MyApp;
