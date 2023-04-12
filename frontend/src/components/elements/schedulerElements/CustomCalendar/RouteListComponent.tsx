import styles from './RouteListComponent.module.css';
import {Droppable} from 'react-beautiful-dnd';
import CalendarEntry from '@/components/elements/schedulerElements/CustomCalendar/entries/CalendarEntry';
import React from 'react';
import EmptyEntry from '@/components/elements/schedulerElements/CustomCalendar/entries/EmptyEntry';
import {ScheduleAssignment, ScheduleDefinition} from '@/api/models';
import {
    ApiData,
} from '@/api/api';

type routeListComponentProps = {
    index: number,
    start: string,
    interval: number,
    scheduleDefinition: ScheduleDefinition,
    taskData: any[],
    setScheduleAssignments: (e: (ApiData<ScheduleAssignment[]> | undefined)) => void,
    onCreateClick: (e: number, f: number, g: any) => void,
    onRemoveClick: (scheduleAssignmentId: number) => void,
}


export default function RouteListComponent(props: routeListComponentProps) {
    return (
        <div className={styles.full}>
            <div className={styles.route_scheduler_header}>
                <p>{props.scheduleDefinition.name}</p>
            </div>
            <div className={styles.route_scheduler_container}>
                <Droppable droppableId={props.scheduleDefinition.id.toString()} type="task" direction='horizontal'>
                    {(droppableProvided) => (
                        <div ref={droppableProvided.innerRef}
                            {...droppableProvided.droppableProps}
                            className={styles.drop_list}>
                            {props.taskData.map((task, index) => {
                                if (task.type == 0) {
                                    return (
                                        <EmptyEntry
                                            key={index}
                                            index={index}
                                            scheduleDefinitionId={props.scheduleDefinition.id}
                                            onCreateClick={props.onCreateClick}
                                        />
                                    );
                                } else {
                                    const nextOpen = index < props.interval-1 &&
                                        props.taskData[index+1].type == 0;
                                    return (
                                        <CalendarEntry
                                            key={index}
                                            scheduleDefinitionId={props.scheduleDefinition.id}
                                            index={index}
                                            scheduleAssignment={task}
                                            onCreateClick={props.onCreateClick}
                                            nextOpen={nextOpen}
                                            onRemoveClick={props.onRemoveClick}
                                        />
                                    );
                                }
                            })}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}
