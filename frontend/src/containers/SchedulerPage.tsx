import SchedulerSelect from '../components/elements/SchedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/SchedulerElements/SchedulerDetails';
import styles from './schedulerPage.module.css';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {
    getBuildingsList, getLatestScheduleDefinitionsList,
    getLocationGroupsList,
    getUsersList,
    useAuthenticatedApi,
} from '@/api/api';
import {Building, LocationGroup, ScheduleDefinition, User} from '@/api/models';
import Head from 'next/head';


export default function SchedulerPage() {
    const {data: session} = useSession();

    const locationGroupName= 'Gent';

    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();
    const [scheduleDefinitions, setScheduleDefinitions] = useAuthenticatedApi<ScheduleDefinition[]>();
    const [buildings, setBuildings] = useAuthenticatedApi<Building[]>();
    const [users, setUsers] = useAuthenticatedApi<User[]>();

    const currentDay: Date = new Date();
    const [first, setFirst] = useState<number>(currentDay.getDate() - currentDay.getDay());
    const interval: number = 7;

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups, {name: locationGroupName});
    }, [session]);

    useEffect(() => {
        if (locationGroups) {
            getLatestScheduleDefinitionsList(session, setScheduleDefinitions, {name: locationGroups.data.at(0)?.id});
        }
    }, [locationGroups, session]);

    useEffect(() => {
        if (locationGroups) {
            getBuildingsList(session, setBuildings, {name: locationGroups.data.at(0)?.id});
        }
    }, [locationGroups, session]);

    useEffect(() => {
        if (locationGroups) {
            getUsersList(session, setUsers, {name: locationGroups.data.at(0)?.id});
        }
    }, [locationGroups, session]);


    const nextWeek = () => {
        setFirst(first + interval);
    };

    const prevWeek = () => {
        setFirst(first - interval);
    };

    return (
        <>
            <Head>
                <title>Planner</title>
            </Head>
            <div className={styles.full_calendar_flex_container}>
                <SchedulerSelect nextWeek={nextWeek} prevWeek={prevWeek}/>
                <SchedulerDetails
                    start={first}
                    scheduleDefinitions={scheduleDefinitions}
                    users={users}
                    buildings={buildings}
                    interval={interval}/>
            </div>
    </>
    );
}
