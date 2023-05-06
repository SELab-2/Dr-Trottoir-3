import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';

const ProfilePageComponent = dynamic(() =>
    import('../containers/ProfilePage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function ProfilePage() {
    const {data: session} = useSession();

    if (session) {
        return (
            <ProfilePageComponent/>
        );
    } else {
        return (
            <ErrorPage status={403}/>
        );
    }
}
