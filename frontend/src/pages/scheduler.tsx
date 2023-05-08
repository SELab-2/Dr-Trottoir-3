import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import Head from 'next/head';

const DynamicSchedulerComponent = dynamic(() =>
    import('../containers/SchedulerPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function SchedulerPage() {
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
                    <title>Planner</title>
                </Head>
                <DynamicSchedulerComponent/>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Planner</title>
                </Head>
                <LoadingElement/>
            </>
        );
    }
}
