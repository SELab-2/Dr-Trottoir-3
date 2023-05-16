import '@/styles/globals.css';
import '@/styles/main_stylesheet.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';

import {useEffect} from 'react';
import Navbar from '../components/elements/NavbarElement/Navbar';
import Head from 'next/head';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    useEffect(() => {
        import('leaflet').then((L) => {
            L.Icon.Default.imagePath = '/leaflet/images/';
        });
    }, []);

    const getLayout = (props: any) => <Navbar>{props}</Navbar>;
    const cache = createCache({key: 'css', prepend: true});

    return (
        <>
            <Head>
                <title>DrTrottoir</title>
            </Head>
            <SessionProvider session={session} basePath={process.env.NEXT_API_AUTH_URL}>
                <CacheProvider value={cache}>
                    {getLayout(<Component {...pageProps} />)}
                </CacheProvider>
            </SessionProvider>
        </>
    );
}
