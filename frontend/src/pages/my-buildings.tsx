import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import React, {useEffect} from "react";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";
import Head from "next/head";

export default function MyBuildings() {
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
            <>
                <Head>
                    <title>Mijn Gebouwen</title>
                </Head>
                <div>
                    TODO: Not implemented.
                </div>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Mijn Gebouwen</title>
                </Head>
                <LoadingElement/>
            </>
        );
    }
}
