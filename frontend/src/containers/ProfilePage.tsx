import {useSession} from 'next-auth/react';
import React from 'react';
import Head from 'next/head';
import MeElement from '@/components/elements/MeElement/meElement';
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";

export default function UsersPage() {
    const {data: session} = useSession();

    if (session) {
        return (
            <MeElement/>
        );
    } else {
        return (
            <LoadingElement/>
        )
    }
}
