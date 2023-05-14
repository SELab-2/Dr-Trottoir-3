import WeekComponent from '@/components/elements/SchedulerElements/CustomCalendar/WeekComponent';

import styles from './SchedulerDetails.module.css';
import React, {useEffect, useState} from 'react';
import {ApiData, getScheduleAssignmentsList, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Building, ScheduleAssignment, ScheduleDefinition, User} from '@/api/models';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';


type schedulerDetailsProps = {
    users: ApiData<User[]> | undefined,
    scheduleDefinitions: ApiData<ScheduleDefinition[]> | undefined,
    buildings: ApiData<Building[]> | undefined,
    start: number,
    interval: number,
}

export default function SchedulerDetails(props: schedulerDetailsProps) {
    const {data: session} = useSession();
    const [scheduleAssignments, setScheduleAssignments] = useAuthenticatedApi<ScheduleAssignment[]>();

    const [triggerReload, setTriggerReload] = useState<boolean>(false);

    const loadAssignments = () => {
        if (props.scheduleDefinitions?.data) {
            const allScheduleDefinitionIds = props.scheduleDefinitions.data.map((scheduleDefinition) => {
                return scheduleDefinition.id;
            }).toString();

            const firstDay = new Date();
            const lastDay = new Date();
            firstDay.setDate(props.start - 1);
            firstDay.setHours(firstDay.getHours() + 2);
            lastDay.setDate(props.start + 8);
            lastDay.setHours(lastDay.getHours() + 2);

            getScheduleAssignmentsList(
                session,
                setScheduleAssignments,
                {
                    schedule_definition__in: allScheduleDefinitionIds,
                    assigned_date__gt: firstDay.toISOString().split('T')[0],
                    assigned_date__lt: lastDay.toISOString().split('T')[0],
                });
        }
    }

    const clearAssignments = () => {
        console.log("here")
        const emptyScheduleAssignment: ApiData<ScheduleAssignment[]> = {
            status: 0,
            success: true,
            data: []
        }
        setScheduleAssignments(emptyScheduleAssignment);
    };

    useEffect(() => {
        if (triggerReload) {
            setTriggerReload(false);
        }
        clearAssignments();
        loadAssignments();
    }, [props.scheduleDefinitions, props.start, session, triggerReload]);

    // repeat every second
    useEffect(() => {
        const intervalId = setInterval(() => {
            // loadAssignments();
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (props.users?.data && props.scheduleDefinitions?.data && props.buildings?.data) {
        let filteredAssignments: ApiData<ScheduleAssignment[]> | undefined = undefined;
        if (scheduleAssignments) {
            filteredAssignments = {
                data: scheduleAssignments.data,
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
                    buildings={props.buildings}
                    setScheduleAssignments={setScheduleAssignments}
                    start={props.start}
                    interval={props.interval}
                    setTriggerReload={setTriggerReload}/>
            </div>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}
