import '@/styles/globals.css';
import '@/styles/main_stylesheet.css';
import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';

import NavBar from '../components/elements/navbarElement/navbar';


export default function App({Component, pageProps: {session, ...pageProps}}: AppProps) {
  const getLayout = (props) => <NavBar>{props}</NavBar>;

  return (
    <SessionProvider session={session} basePath={'http://localhost:3002/api/auth'}>
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  );
}
