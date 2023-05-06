import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import UserElement from '@/components/elements/UserElement/UserElement';
import {useSession} from 'next-auth/react';
import {getBuildingsList, getLocationGroupsList, getUsersList, useAuthenticatedApi} from '@/api/api';
import {Building, LocationGroup, User} from '@/api/models';
import React, {useEffect, useState} from 'react';
import UserTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/UserTopBarComponent';
import styles from './containerStyles.module.css';
import UserListButtonComponent from '@/components/elements/ListViewElement/ListButtonElements/UserListButtonComponent';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Head from 'next/head';
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';
import MeElement from "@/components/elements/MeElement/meElement";

export default function UsersPage() {
    const {data: session} = useSession();

    if (session) {
        return (

            <>
                <Head>
                    <title>Profile</title>
                </Head>
                <MeElement/>
            </>
        );
    } else {
        return (<div>Loading...</div>);
    }
}
