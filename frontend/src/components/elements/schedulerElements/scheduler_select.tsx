import styles from './scheduler_select.module.css';
import React from 'react';

export default function SchedulerSelect(props: any) {
    return (
        <div className={styles.row_flex_container}>
            <div className={styles.top_bar}/>
            <div className={styles.content_space}>
                {props.children}
            </div>
        </div>
    );
}
