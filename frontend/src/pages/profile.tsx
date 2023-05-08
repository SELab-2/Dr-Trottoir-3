import dynamic from 'next/dynamic';
import {useSession} from 'next-auth/react';
import ErrorPage from '@/containers/ErrorPage';
import {useRouter} from "next/router";
import {useEffect} from "react";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";

const ProfilePageComponent = dynamic(() =>
    import('../containers/ProfilePage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function ProfilePage() {
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
            <ProfilePageComponent/>
        );
    } else {
        return (
            <LoadingElement/>
        );
    }
}
