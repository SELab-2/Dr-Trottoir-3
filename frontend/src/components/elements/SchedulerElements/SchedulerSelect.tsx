import styles from './SchedulerSelect.module.css';
import React from 'react';
import Button from '@mui/material/Button';

type schedulerSelectProps = {
    nextWeek: any,
    prevWeek: any,
}

export default function SchedulerSelect({nextWeek, prevWeek}: schedulerSelectProps) {
    return (
        <div className={styles.calendar_selector}>
            <Button onClick={() => (prevWeek())}>previous</Button>
            <Button onClick={() => (nextWeek())}>next</Button>
        </div>
    );
}
