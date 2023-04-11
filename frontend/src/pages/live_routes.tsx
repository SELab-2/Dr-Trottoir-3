import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';

const DynamicLiveRoutesComponent = dynamic(() =>
    import('../containers/LiveRoutesPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LiveRoutesPage() {
    const {data: session} = useSession();

    /* TODO
        To integrate the active route, add the following component (and replace with the schedule
        assignment id with an appropriate one). Also, in ActiveRouteComponent, remove the TODO on line 368.

        <ActiveRouteComponent id={1}></ActiveRouteComponent>
     */
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
