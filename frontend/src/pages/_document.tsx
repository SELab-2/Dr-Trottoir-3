import {Html, Head, Main, NextScript} from 'next/document';

export default function Document() {
    return (
        <Html lang="en">

            <Head>


                {/* eslint-disable-next-line max-len */}
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
                {/* eslint-disable-next-line max-len */}
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                {/* eslint-disable-next-line max-len */}
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <link rel="manifest" href="/icons/site.webmanifest" />
                {/* eslint-disable-next-line max-len */}
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />


            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
