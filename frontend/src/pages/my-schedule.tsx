import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import React, {useEffect} from 'react';
import Head from 'next/head';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';

const StudentTaskListPage = dynamic(() =>
    import('../containers/StudentTaskListPage'), {ssr: false}
);


export default function MySchedule() {
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
                    <title>Mijn Planning</title>
                </Head>
                <StudentTaskListPage />
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Mijn Planning</title>
                </Head>
                <LoadingElement/>
            </>
        );
    }
}
