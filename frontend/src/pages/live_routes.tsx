import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';

const DynamicLiveRoutesComponent = dynamic(() =>
    import('../containers/LiveRoutesPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LiveRoutesPage() {
    const {data: session} = useSession();

    if (session) {
        return (
            <DynamicLiveRoutesComponent/>
        );
    } else {
        return (
            <ErrorPage status={403}/>
        );
    }
}
