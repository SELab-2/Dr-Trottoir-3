import RegisterPageElement from '@/components/elements/LoginPageElement/RegisterPageElement';
import Head from 'next/head';
import React from 'react';
import {useRouter} from 'next/router';

export default function RegisterPage() {
    const router = useRouter();
    const {uuid} = router.query;

    return (
        <>
            <Head>
                <title>Register</title>
            </Head>
            <RegisterPageElement uuid={uuid}/>
        </>
    );
}
