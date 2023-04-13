import SchedulerSelect from '../components/elements/schedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/schedulerElements/SchedulerDetails';
import styles from './SchedulerPage.module.css';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {
    getBuildingsList,
    getLocationGroupsList,
    getScheduleDefinitionsList, getUsersList,
    useAuthenticatedApi,
} from '@/api/api';
import {Building, LocationGroup, ScheduleDefinition, User} from '@/api/models';


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
            getScheduleDefinitionsList(session, setScheduleDefinitions, {name: locationGroups.data.at(0)?.id});
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
        <div className={styles.full_calendar_flex_container}>
            <SchedulerSelect nextWeek={nextWeek} prevWeek={prevWeek}/>
            <SchedulerDetails
                start={first}
                scheduleDefinitions={scheduleDefinitions}
                users={users}
                buildings={buildings}
                interval={interval}/>
        </div>
    );
}
