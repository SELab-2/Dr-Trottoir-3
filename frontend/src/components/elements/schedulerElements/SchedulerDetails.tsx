import WeekComponent from '@/components/elements/schedulerElements/CustomCalendar/WeekComponent';

import styles from './SchedulerDetails.module.css';
import React, {useEffect} from 'react';
import {ApiData, getScheduleAssignmentsList, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import {ScheduleAssignment, ScheduleDefinition, User} from '@/api/models';


type schedulerDetailsProps = {
    users: ApiData<User[]> | undefined,
    scheduleDefinitions: ApiData<ScheduleDefinition[]> | undefined,
    start: number,
    interval: number,
}

export default function SchedulerDetails(props: schedulerDetailsProps) {
    const {data: session} = useSession();
    const [scheduleAssignments, setScheduleAssignments] = useAuthenticatedApi<ScheduleAssignment[]>();

    useEffect(() => {
        if (props.scheduleDefinitions?.data) {
            getScheduleAssignmentsList(
                session,
                setScheduleAssignments);
        }
    }, [props.scheduleDefinitions, props.start, session]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            getScheduleAssignmentsList(session, setScheduleAssignments);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (props.users?.data && props.scheduleDefinitions?.data) {
        const allScheduleDefinitionIds = props.scheduleDefinitions.data.map((scheduleDefinition) => {
            return scheduleDefinition.id;
        });

        const allDates = Array.from(Array(props.interval).keys()).map((index) => {
            const date = new Date();
            date.setDate(props.start + index);
            return date.toISOString().split('T')[0];
        });

        let filteredAssignments: ApiData<ScheduleAssignment[]> | undefined = undefined;
        if (scheduleAssignments) {
            filteredAssignments = {
                data: scheduleAssignments.data.filter((scheduleAssignment) => {
                    return allScheduleDefinitionIds.includes(scheduleAssignment.schedule_definition) &&
                        allDates.includes(scheduleAssignment.assigned_date);
                }),
                status: scheduleAssignments.status,
                success: scheduleAssignments.success,
            };
        }


        return (
            <div className={styles.calendar_component}>
                <WeekComponent
                    users={props.users}
                    scheduleDefinitions={props.scheduleDefinitions}
                    scheduleAssignments={filteredAssignments}
                    setScheduleAssignments={setScheduleAssignments}
                    start={props.start}
                    interval={props.interval}/>
            </div>
        );
    } else {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    }
}
