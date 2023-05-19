import Head from 'next/head';
import {useSession} from 'next-auth/react';
import {getMe, useAuthenticatedApi} from '@/api/api';
import {User} from '@/api/models';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function Home() {
    const [userData, setUserData] = useAuthenticatedApi<User>();

    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        if (session) {
            // @ts-ignore
            getMe(session, setUserData);
        }
    }, [session]);

    useEffect(() => {
        // when session is null, failed to retrieve (caution: not the same as when undefined)
        if (session === null) {
            router.push('/login');
        }
    }, [session]);

    useEffect(() => {
        if (userData && userData.data) {
            if (userData.data.student && !userData.data.student.is_super_student) {
                router.push('/my-schedule');
            } else if (userData.data.syndicus) {
                router.push('/building');
            } else {
                router.push('/live_routes');
            }
        }
    }, [userData]);
    return (
        <Head>
            <title>DrTrottoir</title>
            <meta name="description" content="DrTrottoir" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}
