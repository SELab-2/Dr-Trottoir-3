import React, {useEffect, useState} from 'react';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import styles from './WeekComponent.module.css';
import RouteListComponent from './RouteListComponent';
import DayHeader from './DayHeader';
import {Building, ScheduleAssignment, ScheduleDefinition, User} from '@/api/models';
import {
    ApiData,
    deleteScheduleAssignment,
    patchScheduleAssignmentDetail,
    postScheduleAssignment,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Backdrop} from '@mui/material';
import CreateAssignmentForm from './CreateAssignmentForm';

type schedulerProps = {
    users: ApiData<User[]>,
    scheduleDefinitions: ApiData<ScheduleDefinition[]>,
    scheduleAssignments: ApiData<ScheduleAssignment[]> | undefined,
    buildings: ApiData<Building[]>,
    setScheduleAssignments: (e: (ApiData<ScheduleAssignment[]> | undefined)) => void,
    start: number,
    interval: number,
    setTriggerReload: (e: any) => void,
}

export default function WeekComponent(props: schedulerProps) {
    const {data: session} = useSession();

    const [requestChecker, setRequestChecker] = useState<any>();
    const [createUserInfo, setCreateUserInfo] = useState<any>();
    const [tasks, setTasks] = useState<{[e: string]: any[]}>({});

    const firstDay = new Date();
    firstDay.setDate(props.start);
    firstDay.setHours(firstDay.getHours() + 2);


    const updateTaskLists = (scheduleAssignments: ApiData<ScheduleAssignment[]>) => {
        const generatedTasks = Object.fromEntries(props.scheduleDefinitions.data.map((scheduleDefinition) => {
            const taskList: any[] = new Array(props.interval).fill({type: 0});
            scheduleAssignments.data
                .filter((scheduleAssignment) => {
                    return scheduleAssignment.schedule_definition == scheduleDefinition.id;
                })
                .forEach((assignment) => {
                    const index = new Date(assignment.assigned_date).getDay();

                    taskList[index] = {
                        type: 1,
                        user: props.users.data.filter((e) => e.id == assignment.user).at(0),
                        id: assignment.id,
                        date: assignment.assigned_date,
                        linkLeft: false,
                        linkRight: false,
                    };

                    if (index > 0 &&
                            taskList[index - 1].type == 1 &&
                            taskList[index - 1].user.id == assignment.user) {
                        taskList[index - 1].linkRight = true;
                        taskList[index].linkLeft = true;
                    }
                    if (index < props.interval - 1 && taskList[index + 1].type == 1 &&
                            taskList[index + 1].user.id == assignment.user) {
                        taskList[index + 1].linkLeft = true;
                        taskList[index].linkRight = true;
                    }
                });
            return [scheduleDefinition.id, taskList];
        }));

        setTasks(generatedTasks);
    };


    const removeTask = (id: number) => {
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


    const createTask = (scheduleDefinitionIndex: number,
        scheduleAssignmentIndex: number|string,
        userId: number|undefined) => {
        if (props.scheduleAssignments) {
            if (!userId) {
                setCreateUserInfo({
                    schedulerDefinitionIndex: scheduleDefinitionIndex,
                    schedulerAssignmentIndex: scheduleAssignmentIndex,
                });
            } else {
                let newTask: ScheduleAssignment;
                if (typeof scheduleAssignmentIndex == 'number') {
                    const date = new Date();
                    date.setDate(props.start + scheduleAssignmentIndex);
                    date.setHours(date.getHours() + 2);
                    newTask = {
                        id: -1, // will be ignored by django, but required to fit type
                        user: userId,
                        assigned_date: date.toISOString().split('T')[0],
                        schedule_definition: scheduleDefinitionIndex,
                    };
                } else {
                    newTask = {
                        id: -1, // will be ignored by django, but required to fit type
                        user: userId,
                        assigned_date: scheduleAssignmentIndex,
                        schedule_definition: scheduleDefinitionIndex,
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
            }
        }
    };


    const onDragEnd = (result: DropResult) => {
        document.body.style.color = 'inherit';

        if (props.scheduleAssignments) {
            const {destination, source} = result;

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
            const newScheduleAssignments = {
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
                                newDate.setHours(newDate.getHours() + 2);
                                e.assigned_date = newDate.toISOString().split('T')[0];
                                patchScheduleAssignmentDetail(
                                    session,
                                    e.id,
                                    {assigned_date: e.assigned_date},
                                    setRequestChecker);
                            }
                        } else if (source.index > index) {
                            if (destination.index <= index) {
                                if (index >= props.interval-1) {
                                    deleteScheduleAssignment(session, e.id, setRequestChecker);
                                } else {
                                    newDate.setDate(props.start + index + 1);
                                    newDate.setHours(newDate.getHours() + 2);
                                    e.assigned_date = newDate.toISOString().split('T')[0];
                                    patchScheduleAssignmentDetail(
                                        session,
                                        e.id,
                                        {assigned_date: e.assigned_date},
                                        setRequestChecker);
                                }
                            }
                        }
                    } else {
                        if (e.schedule_definition == Number(source.droppableId)) {
                            if (source.index < index) {
                                newDate.setDate(props.start + index - 1);
                                newDate.setHours(newDate.getHours() + 2);
                                e.assigned_date = newDate.toISOString().split('T')[0];
                                patchScheduleAssignmentDetail(
                                    session,
                                    e.id,
                                    {assigned_date: e.assigned_date},
                                    setRequestChecker);
                            }
                        } else if (e.schedule_definition == Number(destination.droppableId)) {
                            if (destination.index <= index) {
                                if (index >= props.interval-1) {
                                    deleteScheduleAssignment(session, e.id, setRequestChecker);
                                } else {
                                    newDate.setDate(props.start + index + 1);
                                    newDate.setHours(newDate.getHours() + 2);
                                    e.assigned_date = newDate.toISOString().split('T')[0];
                                    patchScheduleAssignmentDetail(
                                        session,
                                        e.id,
                                        {assigned_date: e.assigned_date},
                                        setRequestChecker);
                                }
                            }
                        }
                    }

                    if (e.schedule_definition == Number(source.droppableId) && index == source.index) {
                        // primary move object
                        newDate.setDate(props.start + destination.index);
                        newDate.setHours(newDate.getHours() + 2);
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
            };

            updateTaskLists(newScheduleAssignments);
            props.setScheduleAssignments(newScheduleAssignments);
        }
    };

    useEffect(() => {
        if (requestChecker) {
            props.setTriggerReload(true);
            if (props.scheduleAssignments) {
                updateTaskLists(props.scheduleAssignments);
            }
        }
    }, [requestChecker]);

    useEffect(() => {
        if (props.scheduleAssignments) {
            updateTaskLists(props.scheduleAssignments);
        }
    }, [props.scheduleAssignments]);


    return (
        <div className={styles.full_week}>
            <div className={styles.calendar_header_container}>
                <div className={styles.calendar_header_task}>
                    TODO: route settings button
                </div>
                <div className={styles.calendar_header_days}>
                    {Array.from(Array(props.interval).keys()).map((dayId) => {
                        const day = new Date(new Date().setDate(props.start + dayId));
                        day.setHours(day.getHours() + 2);
                        const date = day.toISOString().split('T')[0];
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
                            const taskData = tasks[scheduleDefinitionData.id] ? tasks[scheduleDefinitionData.id] : [];
                            const filterBuildings = props.buildings.data
                                .filter((e) => scheduleDefinitionData.buildings.includes(e.id));
                            return (
                                <RouteListComponent
                                    key={index}
                                    index={index}
                                    start={firstDay.toISOString().split('T')[0]}
                                    interval={props.interval}
                                    scheduleDefinition={scheduleDefinitionData}
                                    buildings={filterBuildings}
                                    taskData={taskData}
                                    setScheduleAssignments={props.setScheduleAssignments}
                                    onCreateClick={createTask}
                                    onRemoveClick={removeTask}
                                />
                            );
                        })}
                    </div>
                </div>
            </DragDropContext>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={!!createUserInfo}
                invisible={false}
            >
                <CreateAssignmentForm
                    onCreateClick={createTask}
                    setOpen={setCreateUserInfo}
                    start={props.start}
                    allUsers={props.users}
                    allRoutes={props.scheduleDefinitions}
                    initialInfo={createUserInfo}/>
            </Backdrop>
        </div>
    );
}
