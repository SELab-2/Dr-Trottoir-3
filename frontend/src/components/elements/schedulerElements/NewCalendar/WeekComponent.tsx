import React, {memo, useEffect, useState} from 'react';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import styles from './WeekComponent.module.css';
import RouteListComponent from './RouteListComponent';
import DayHeader from '@/components/elements/schedulerElements/NewCalendar/DayHeader';
import {ScheduleAssignment, ScheduleDefinition, User} from '@/api/models';
import {ApiData, getScheduleAssignmentsList, patchScheduleAssignmentDetail} from '@/api/api';
import {useSession} from 'next-auth/react';

type schedulerProps = {
    users: ApiData<User[]>,
    scheduleDefinitions: ApiData<ScheduleDefinition[]>,
    scheduleAssignments: ApiData<ScheduleAssignment[]> | undefined,
    setScheduleAssignments: (e: (ApiData<ScheduleAssignment[]> | undefined)) => void,
    start: number,
    interval: number,
}

function WeekComponent(props: schedulerProps) {
    const {data: session} = useSession();
    const [requestChecker, setRequestChecker] = useState<any>();

    const firstDay = new Date();
    firstDay.setDate(props.start);

    const onDragEnd = (result: DropResult) => {
        document.body.style.color = 'inherit';

        if (props.scheduleAssignments) {
            const {destination, source, draggableId} = result;

            // drop at start position
            if (source.droppableId == destination?.droppableId && source.index == destination.index) {
                return;
            }

            // illegal destination
            if (!destination) {
                return;
            }


            const newDate = new Date();

            // patch moved
            props.setScheduleAssignments({
                status: props.scheduleAssignments.status,
                success: props.scheduleAssignments.success,
                data: props.scheduleAssignments.data.map((e) => {
                    const index: number = new Date(e.assigned_date).getDate() - props.start;
                    if (Number(destination.droppableId) == Number(source.droppableId) &&
                        Number(destination.droppableId) == e.schedule_definition) {
                        // object moved on this row
                        if (source.index < index) {
                            if (destination.index >= index) {
                                newDate.setDate(props.start + index-1);
                                e.assigned_date = newDate.toISOString().split('T')[0];
                                patchScheduleAssignmentDetail(
                                    session,
                                    e.id,
                                    {assigned_date: e.assigned_date},
                                    setRequestChecker);
                            }
                        } else if (source.index > index) {
                            if (destination.index <= index) {
                                newDate.setDate(props.start + index+1);
                                e.assigned_date = newDate.toISOString().split('T')[0];
                                patchScheduleAssignmentDetail(
                                    session,
                                    e.id,
                                    {assigned_date: e.assigned_date},
                                    setRequestChecker);
                            }
                        }
                    } else {
                        if (e.schedule_definition == Number(source.droppableId)) {
                            if (source.index < index) {
                                newDate.setDate(props.start + index - 1);
                                e.assigned_date = newDate.toISOString().split('T')[0];
                                patchScheduleAssignmentDetail(
                                    session,
                                    e.id,
                                    {assigned_date: e.assigned_date},
                                    setRequestChecker);
                            }
                        } else if (e.schedule_definition == Number(destination.droppableId)) {
                            if (destination.index <= index) {
                                newDate.setDate(props.start + index + 1);
                                e.assigned_date = newDate.toISOString().split('T')[0];
                                patchScheduleAssignmentDetail(
                                    session,
                                    e.id,
                                    {assigned_date: e.assigned_date},
                                    setRequestChecker);
                            }
                        }
                    }

                    if (e.schedule_definition == Number(source.droppableId) && index == source.index) {
                        // primary move object
                        newDate.setDate(props.start + destination.index);
                        patchScheduleAssignmentDetail(
                            session,
                            e.id,
                            {
                                schedule_definition: Number(destination.droppableId),
                                assigned_date: newDate.toISOString().split('T')[0],
                            },
                            setRequestChecker);
                        e.assigned_date = newDate.toISOString().split('T')[0];
                        e.schedule_definition = Number(destination.droppableId);
                    }

                    return e;
                }),
            });
        }
    };

    useEffect(() => {
        if (requestChecker) {
            getScheduleAssignmentsList(session, props.setScheduleAssignments);
        }
    }, [requestChecker]);


    return (
        <div className={styles.full_week}>
            <div className={styles.calendar_header_container}>
                <div className={styles.calendar_header_task}>
                    TODO: route settings button
                </div>
                <div className={styles.calendar_header_days}>
                    {Array.from(Array(props.interval).keys()).map((dayId) => {
                        const date = new Date(new Date().setDate(props.start + dayId)).toISOString().split('T')[0];
                        return (
                            <DayHeader
                                key={date}
                                date={date}
                            />
                        );
                    })}
                </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.scrollable}>
                    <div className={styles.row_container}>
                        {props.scheduleDefinitions.data.map((scheduleDefinitionData, index) => {
                            return (
                                <RouteListComponent
                                    key={index}
                                    index={index}
                                    start={firstDay.toISOString().split('T')[0]}
                                    interval={props.interval}
                                    scheduleDefinition={scheduleDefinitionData}
                                    scheduleAssignments={props.scheduleAssignments}
                                    setScheduleAssignments={props.setScheduleAssignments}
                                />
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>
        </div>
    );
}


export default memo(WeekComponent);
