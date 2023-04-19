import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';

const DynamicSchedulerComponent = dynamic(() =>
    import('../containers/SchedulerPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function SchedulerPage() {
    const {data: session} = useSession();

    if (session) {
        return (
            <DynamicSchedulerComponent/>
        );
    } else {
        return (
            <ErrorPage status={403}/>
        );
    }
}
