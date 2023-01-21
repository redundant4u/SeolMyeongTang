import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>SeolMyeongTang</title>

                <link rel="icon" href="/favicon.ico" />

                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=0.8, maximum-scale=0.8" />
                <meta name="description" content="설명탕 - SeolMyeongTang" />
            </Head>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </>
    );
}

export default MyApp;
