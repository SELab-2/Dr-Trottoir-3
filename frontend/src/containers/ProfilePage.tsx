import {useSession} from 'next-auth/react';
import React from 'react';
import Head from 'next/head';
import MeElement from '@/components/elements/MeElement/meElement';

export default function UsersPage() {
    const {data: session} = useSession();

    if (session) {
        return (

            <>
                <Head>
                    <title>Profile</title>
                </Head>
                <MeElement/>
            </>
        );
    } else {
        return (<div>Loading...</div>);
    }
}
