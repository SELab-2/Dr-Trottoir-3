import WeekComponent from './CalendarElements/WeekComponent';

import styles from './SchedulerDetails.module.css';
import React from 'react';

export default function SchedulerDetails(props: any) {
    return (
        <div className={styles.calendar_component}>
            <WeekComponent/>
        </div>
    );
}
