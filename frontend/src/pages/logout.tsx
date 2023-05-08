import dynamic from 'next/dynamic';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";

const DynamicLogoutComponent = dynamic(() =>
    import('../containers/LogoutPage'), {ssr: false}
);

// TODO CAN BE REMOVED?
// eslint-disable-next-line require-jsdoc
export default function LogoutPage() {
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
            <DynamicLogoutComponent/>
        );
    } else {
        return (
            <LoadingElement/>
        );
    }
}
