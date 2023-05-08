import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';
import {useEffect} from "react";
import {getMe} from "@/api/api";
import {useRouter} from "next/router";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";

const DynamicLiveRoutesComponent = dynamic(() =>
    import('../containers/LiveRoutesPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LiveRoutesPage() {
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
            <DynamicLiveRoutesComponent/>
        );
    } else {
        return (
            <LoadingElement/>
        );
    }
}
