import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';
import BuildingDetail from '@/components/elements/buildingdetailElement/buildingDetail';

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    const {data: session} = useSession();

    if (session) {
        return (
            <BuildingDetail id={10}/>
        );
    } else {
        return (
            <ErrorPage status={403}/>
        );
    }
}
