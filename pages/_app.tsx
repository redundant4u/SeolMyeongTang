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

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>SeolMyeongTang</title>

                <link rel="icon" href="/favicon.ico" />

                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=0.8, maximum-scale=0.8" />
                <meta name="description" content="설명탕 - SeolMyeongTang" />

                <meta name="google-site-verification" content="-3v0hyjAm1rkvaDM7eWEfYTlnekJVSsTGDmTW2v3fCo" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
