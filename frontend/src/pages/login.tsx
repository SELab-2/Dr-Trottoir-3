import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

const DynamicLoginComponent = dynamic(() =>
    import('../containers/LoginPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LoginPage() {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <DynamicLoginComponent/>
        </>
    );
}
