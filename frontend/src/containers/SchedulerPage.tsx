import SchedulerSelect from '../components/elements/schedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/schedulerElements/SchedulerDetails';
import styles from './SchedulerPage.module.css';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {
    getLocationGroupsList,
    getScheduleAssignmentsList,
    getScheduleDefinitionsList,
    useAuthenticatedApi,
} from '@/api/api';
import {LocationGroup, ScheduleAssignment, ScheduleDefinition} from '@/api/models';


export default function SchedulerPage() {
    const {data: session} = useSession();

    const locationGroupName= 'Gent';

    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();
    const [scheduleDefinitions, setScheduleDefinitions] = useAuthenticatedApi<ScheduleDefinition[]>();

    const [scheduleAssignments, setScheduleAssignemnts] = useAuthenticatedApi<ScheduleAssignment[]>();


    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups, {name: locationGroupName});
    }, [session]);

    useEffect(() => {
        if (locationGroups) {
            getScheduleDefinitionsList(session, setScheduleDefinitions, {name: locationGroups.data.at(0)?.id});
        }
    }, [locationGroups, session]);

    useEffect(() => {
        if (scheduleDefinitions) {
            setScheduleAssignemnts(undefined);
            scheduleDefinitions.data.forEach((schedule) =>
                // @ts-ignore
                getScheduleAssignmentsList(session, (e) => setScheduleAssignemnts({...(scheduleAssignments ? scheduleAssignments : []), e}), {name: schedule.id})
            );
        }
    }, [scheduleDefinitions, session]);

    useEffect(() => {
        console.log(scheduleAssignments);
    }, [scheduleAssignments]);

    const currentDay: Date = new Date();
    const [first, setFirst] = useState<number>(currentDay.getDate() - currentDay.getDay());
    const interval = 7;
    //
    // const [routes, setRoutes] = useState([]);
    // const [users] = useState([]);
    //
    // useEffect(() => {
    //     // load routes
    //     scheduleDefinitions.forEach((route) => {
    //         scheduleDefinitions['active'] = false;
    //     });
    //     setRoutes(scheduleDefinitions);
    // }, [routes]);


    const nextWeek = () => {
        setFirst(first + interval);
    };

    const prevWeek = () => {
        setFirst(first - interval);
    };

    return (
        <div className={styles.full_calendar_flex_container}>
            <SchedulerSelect nextWeek={nextWeek} prevWeek={prevWeek}/>
            <SchedulerDetails start={first} routes={[]} setRoutes={() => {}} users={[]} interval={interval}/>
        </div>
    );
}
