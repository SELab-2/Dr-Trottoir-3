import '@/styles/globals.css';
import '@/styles/main_stylesheet.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';

import Navbar from '../components/elements/navbarElement/Navbar';

export default function App(
    {Component, pageProps: {session, ...pageProps}}: AppProps
) {
    const getLayout = (props: any) => <Navbar>{props}</Navbar>;

    return (
        // eslint-disable-next-line no-undef
        <SessionProvider session={session} basePath={process.env.NEXT_API_AUTH_URL}>
            {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
    );
}
