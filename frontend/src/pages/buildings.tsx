import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import Head from 'next/head';

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        // when session is null, failed to retrieve (caution: not the same as when undefined)
        if (session === null) {
            router.push('/login');
        }
    }, [session]);

    if (session) {
        return (
            <>
                <Head>
                    <title>Gebouwen</title>
                </Head>
                <DynamicBuildingsComponent/>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Gebouwen</title>
                </Head>
                <LoadingElement/>
            </>
        );
    }
}
