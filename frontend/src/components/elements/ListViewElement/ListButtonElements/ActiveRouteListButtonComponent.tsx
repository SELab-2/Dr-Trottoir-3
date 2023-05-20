import React, {useEffect} from 'react';
import styles from '@/components/elements/ListViewElement/ListButtonElements/buttonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';
import CheckIcon from '@mui/icons-material/Check';
import {getScheduleAssignmentDetail, useAuthenticatedApi} from "@/api/api";
import {ScheduleAssignment} from "@/api/models";
import {useSession} from "next-auth/react";

const ActiveRouteListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id === props.current;
    const [scheduleAssignment, setScheduleAssignment] =
        useAuthenticatedApi<ScheduleAssignment>();

    const {data: session} = useSession()

    console.log(scheduleAssignment?.data)

    const progress = (scheduleAssignment?.data.buildings_done ? scheduleAssignment?.data.buildings_done : 0)
    // @ts-ignore
        / (scheduleAssignment?.data.buildings_count ? scheduleAssignment?.data.buildings_count : 1);

    useEffect(() => {
        getScheduleAssignmentDetail(session, setScheduleAssignment, props.data.id)
    }, [session]);

    return (

        <Button id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
            className={styles.button_default}
            onClick={()=>props.onClick(props.data.id)}>
            <div className={styles.content_container}>
                <div className={styles.big_item_text}>
                    {props.data.name}
                </div>
                <div className={styles.small_item_text}>
                    {props.data.location_group}
                </div>
                <div className={styles.small_item_text}>
                    {props.data.student}
                </div>
            </div>
            <div className={styles.icon_container}>
                <div className={styles.listItemRightSide}>
                    {conditionalCheckmark(progress === 1)}
                    <div className={styles.very_big_item_text}>
                        {Math.round(progress*100)}%
                    </div>
                </div>
            </div>
        </Button>
    );
};


const conditionalCheckmark = (checkmark: boolean) => {
    if (checkmark) {
        return (
            <CheckIcon></CheckIcon>
        );
    }
};


export default ActiveRouteListButtonComponent;
