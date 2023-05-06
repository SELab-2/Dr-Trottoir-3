import LogoutPageElement from '@/components/elements/LogoutPageElement/LogoutPageElement';
import Head from 'next/head';
import React, {useEffect} from 'react';
import {signOut} from "next-auth/react";

export default function LogoutPage() {
    useEffect(() => {
        signOut({callbackUrl: '/login'})
    }, []);

    return (
        <Head>
            <title>Logout</title>
        </Head>
    );
}
