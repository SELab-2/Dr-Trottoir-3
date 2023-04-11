import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';

const DynamicRoutesComponent = dynamic(() =>
    import('../containers/UsersPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function UsersPage() {
    const {data: session} = useSession();

    if (session) {
        return (
            <DynamicRoutesComponent/>
        );
    } else {
        return (
            <ErrorPage status={403}/>
        );
    }
}
