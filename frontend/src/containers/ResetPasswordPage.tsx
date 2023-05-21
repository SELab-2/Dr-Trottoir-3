import ResetPasswordPageElement from '@/components/elements/LoginPageElement/ResetPasswordPageElement';
import Head from 'next/head';
import React from 'react';
import {useRouter} from 'next/router';

export default function ResetPasswordPage() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Reset Password</title>
            </Head>
            <ResetPasswordPageElement uuid={router.query.uuid as string}/>
        </>
    );
}
