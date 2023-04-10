import SchedulerSelect from '../components/elements/schedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/schedulerElements/SchedulerDetails';
import styles from './SchedulerPage.module.css';
import React, {useEffect, useState} from 'react';
import {Api, getDetail, getList} from "@/api/api";
import {useSession} from "next-auth/react";


export default function SchedulerPage() {

    const {data: session} = useSession();
    console.log(session);

    // const {data: session} = useSession();
    // const locationGroupID= 1;
    // const scheduleDefinitionsResult = getList(Api.ScheduleDefinitions, {}, {});
    // console.log(scheduleDefinitionsResult)
    //
    // console.log(scheduleDefinitionsResult.data ? scheduleDefinitionsResult.data.results.length : 0);

    // if (scheduleDefinitions?.data) {
        // @ts-ignore
    // for (let i = 0; i < (scheduleDefinitionsResult.data ? scheduleDefinitionsResult.data.results.length : 0); i++) {
    //     console.log(i);
    //     const scheduleAssignments = getList(Api.ScheduleAssignments, {}, {'schedule_definition': 1}).data;
    //     console.log(scheduleAssignments);
    // }
    // }




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
