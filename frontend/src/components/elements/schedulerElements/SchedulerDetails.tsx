import WeekComponent from './NewCalendar/WeekComponent';

import styles from './SchedulerDetails.module.css';
import React from 'react';


type schedulerDetailsProps = {
    users: any,
    routes: any,
    setRoutes: any,
    start: number,
    interval: number,
}

export default function SchedulerDetails({users, routes, setRoutes, start, interval}: schedulerDetailsProps) {
    return (
        <div className={styles.calendar_component}>
            <WeekComponent users={users} routes={routes} setRoutes={setRoutes} start={start} interval={interval}/>
        </div>
    );
}
