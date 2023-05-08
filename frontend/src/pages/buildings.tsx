import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';
import {useRouter} from "next/router";
import {useEffect} from "react";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    const router = useRouter();
    const {data: session} = useSession();

    useEffect(() => {
        // when session is null, failed to retrieve (caution: not the same as when undefined)
        if(session === null) {
            router.push("/login");
        }
    }, [session]);

    if (session) {
        return (
            <DynamicBuildingsComponent/>
        );
    } else {
        return (
            <LoadingElement/>
        );
    }
}
