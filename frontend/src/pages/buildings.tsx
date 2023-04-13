import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    const {data: session} = useSession();

    // To add the building, add a <BuildingDetail id={...}/> component where id is the id of the building
    if (session) {
        return (
            <DynamicBuildingsComponent/>
        );
    } else {
        return (
            <ErrorPage status={403}/>
        );
    }
}
