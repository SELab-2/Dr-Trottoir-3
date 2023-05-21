import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

const DynamicComponent = dynamic(() =>
    import('../containers/ResetPasswordFormPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function ResetPasswordFormPage() {
    return (
        <>
            <Head>
                <title>Reset Password</title>
            </Head>
            <DynamicComponent/>
        </>
    );
}
