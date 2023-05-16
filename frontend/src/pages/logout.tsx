import {useRouter} from 'next/router';
import {signOut, useSession} from 'next-auth/react';
import React, {useEffect} from 'react';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import Head from 'next/head';

// eslint-disable-next-line require-jsdoc
export default function LogoutPage() {
    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        // when session is null, failed to retrieve (caution: not the same as when undefined)
        if (session === null) {
            router.push('/login');
        } else {
            signOut({callbackUrl: '/login'});
        }
    }, [session]);

    return (
        <>
            <Head>
                <title>Logout</title>
            </Head>
            <LoadingElement/>
        </>
    );
}
