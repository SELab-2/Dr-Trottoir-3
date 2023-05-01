import LoginPageElement from '@/components/elements/LoginPageElement/LoginPageElement';
import Head from 'next/head';
import React from 'react';

export default function LoginPage() {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <LoginPageElement />
        </>
    );
}
