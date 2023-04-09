import dynamic from 'next/dynamic';
import {useSession} from "next-auth/react";

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    const {data: session} = useSession();
    console.log(session);

    return (
        <DynamicBuildingsComponent/>
    );
}
