import '@/styles/globals.css';
import '@/styles/main_stylesheet.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';

import Navbar from '../components/elements/navbarElement/Navbar';
import {useEffect} from 'react';

export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
    useEffect(() => {
        import('leaflet').then((L) => {
            L.Icon.Default.imagePath = '/leaflet/images/';
        });
    }, []);

    const getLayout = (props: any) => <Navbar>{props}</Navbar>;

    return (
        // eslint-disable-next-line no-undef
        <SessionProvider session={session} basePath={process.env.NEXT_INTERNAL_API_AUTH_URL}>
            {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
    );
}
