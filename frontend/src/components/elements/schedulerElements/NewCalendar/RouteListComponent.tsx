import styles from './RouteListComponent.module.css';
import {Droppable} from 'react-beautiful-dnd';
import CalendarEntry from '@/components/elements/schedulerElements/NewCalendar/entries/CalendarEntry';
import React, {useEffect, memo, useState} from 'react';
import EmptyEntry from '@/components/elements/schedulerElements/NewCalendar/entries/EmptyEntry';
import {ScheduleAssignment, ScheduleDefinition} from '@/api/models';
import {useSession} from 'next-auth/react';
import {
    ApiData,
    deleteScheduleAssignment,
    getScheduleAssignmentsList,
    postScheduleAssignment,
} from '@/api/api';

type routeListComponentProps = {
    index: number,
    start: string,
    interval: number,
    scheduleDefinition: ScheduleDefinition,
    scheduleAssignments: ApiData<ScheduleAssignment[]> | undefined,
    setScheduleAssignments: (e: (ApiData<ScheduleAssignment[]> | undefined)) => void,
}


function RouteListComponent(props: routeListComponentProps) {
    const {data: session} = useSession();

    const [tasks, setTasks] = useState<any[]>([]);
    const [requestChecker, setRequestChecker] = useState<any>();

    useEffect(() => {
        const taskList: any[] = new Array(props.interval).fill({type: 0});

        if (props.scheduleAssignments && props.scheduleAssignments.data) {
            props.scheduleAssignments.data
                .filter((scheduleAssignment) => {
                    return scheduleAssignment.schedule_definition == props.scheduleDefinition.id;
                })
                .forEach((assignment) => {
                    const index = new Date(assignment.assigned_date).getDay();

                    taskList[index] = {
                        type: 1,
                        user: assignment.user,
                        id: assignment.id,
                        date: assignment.assigned_date,
                        linkLeft: false,
                        linkRight: false,
                    };

                    if (index > 0 && taskList[index - 1].type == 1 && taskList[index - 1].user == assignment.user) {
                        taskList[index - 1].linkRight = true;
                        taskList[index].linkLeft = true;
                    }
                    if (index < props.interval - 1 && taskList[index + 1].type == 1 &&
                    taskList[index + 1].user == assignment.user) {
                        taskList[index + 1].linkLeft = true;
                        taskList[index].linkRight = true;
                    }
                });
            setTasks(taskList);
        }
    }, [props.scheduleAssignments]);


    const onRemoveClick = (id: number) => {
        deleteScheduleAssignment(session, id, setRequestChecker);

        if (props.scheduleAssignments) {
            props.setScheduleAssignments(
                {
                    success: props.scheduleAssignments.success,
                    status: props.scheduleAssignments.status,
                    data: props.scheduleAssignments.data.filter((e) => e.id != id),
                }
            );
        }
    };


    const createTask = (index: number, scheduleAssignment: any) => {
        const date = new Date();
        date.setDate(new Date(props.start).getDate() + index);

        let newTask: ScheduleAssignment;
        if (scheduleAssignment == undefined) {
            newTask = {
                id: 0, // will be ignored by django, but required to fit type
                user: 1,
                assigned_date: date.toISOString().split('T')[0],
                schedule_definition: props.scheduleDefinition.id,
            };
        } else {
            newTask = {
                id: -1, // will be ignored by django, but required to fit type
                user: scheduleAssignment.user,
                assigned_date: date.toISOString().split('T')[0],
                schedule_definition: props.scheduleDefinition.id,
            };
        }

        postScheduleAssignment(session, newTask, setRequestChecker);

        if (props.scheduleAssignments) {
            props.setScheduleAssignments(
                {
                    success: props.scheduleAssignments.success,
                    status: props.scheduleAssignments.status,
                    data: [...props.scheduleAssignments.data, newTask],
                }
            );
        }
    };


    useEffect(() => {
        getScheduleAssignmentsList(session, props.setScheduleAssignments);
    }, [requestChecker]);


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
                            {tasks.map((task, index) => {
                                if (task.type == 0) {
                                    return (
                                        <EmptyEntry
                                            key={index}
                                            index={index}
                                            scheduleDefinitionId={props.scheduleDefinition.id}
                                            onCreateClick={createTask}
                                        />
                                    );
                                } else {
                                    const nextOpen = index < props.interval-1 && tasks[index+1].type == 0;
                                    return (
                                        <CalendarEntry
                                            key={index}
                                            scheduleDefinitionId={props.scheduleDefinition.id}
                                            index={index}
                                            scheduleAssignment={task}
                                            onCreateClick={createTask}
                                            nextOpen={nextOpen}
                                            onRemoveClick={onRemoveClick}
                                        />
                                    );
                                }
                            })}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    );
}


export default memo(RouteListComponent);
