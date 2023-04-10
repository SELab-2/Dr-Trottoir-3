import styles from './ReouteListComponent.module.css';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import CalendarEntry from '@/components/elements/schedulerElements/NewCalendar/entries/CalendarEntry';
import React, {useEffect, useState} from 'react';
import EmptyEntry from '@/components/elements/schedulerElements/NewCalendar/entries/EmptyEntry';
import {random} from 'nanoid';
import {Api, getList} from "@/api/api";

type routeListComponentProps = {
    index: number,
    start: string,
    route: any,
    details: any,
    interval: number
}


const mockdata = [
    {id: '0', user: 'user1', date: '2023-04-10'},
    {id: '1', user: 'user1', date: '2023-04-11'},
    {id: '2', user: 'user2', date: '2023-04-12'},
    {id: '3', user: 'user3', date: '2023-04-14'},
];


export default function RouteListComponent({index, start, interval, route, details}: routeListComponentProps) {



    // const scheduleAssignments = getList(Api.ScheduleAssignments, {}, {'schedule_definition': 1}).data;
    // console.log(scheduleAssignments)


    const [assignments, setAssignments] = useState(mockdata);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const taskList = new Array(interval).fill({type: 0});

        assignments.forEach((assignment) => {
            const index = new Date(assignment.date).getDay();

            taskList[index] = {
                type: 1,
                user: assignment.user,
                id: assignment.id,
                date: assignment.date,
                linkLeft: false,
                linkRight: false,
            };

            if (index > 0 && taskList[index-1].type == 1 && taskList[index-1].user == assignment.user) {
                taskList[index-1].linkRight = true;
                taskList[index].linkLeft = true;
            }
            if (index < interval-1 && taskList[index+1].type == 1 && taskList[index+1].user == assignment.user) {
                taskList[index+1].linkLeft = true;
                taskList[index].linkRight = true;
            }
        });
        setTasks(taskList);
    }, [assignments]);


    const onRemoveClick = (id: string) => {
        setAssignments(assignments.filter((e) => e.id != id));
    };


    const createTask = (index, taskData) => {
        const date = new Date();
        date.setDate(new Date(start).getDate() + index);

        let newTask;
        if (taskData == undefined) {
            newTask = {id: random(1).toString(), user: 'newUser', date: date.toISOString().split('T')[0]};
        } else {
            newTask = {id: random(1).toString(), user: taskData.user, date: date.toISOString().split('T')[0]};
        }
        console.log([...assignments, newTask]);
        setAssignments([...assignments, newTask]);
    };


    const onDragEnd = (result: DropResult) => {
        document.body.style.color = 'inherit';

        const {destination, source, draggableId} = result;

        // drop at illegal location
        if (!destination) {
            return;
        }

        // drop at start position
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        let insertedDate = '';
        let id = '';
        const newAssignment = assignments.map((assignment) => {
            if (assignment.date == draggableId) {
                const newDate = new Date();
                newDate.setDate(new Date(assignment.date).getDate() + destination.index - source.index);
                assignment.date = newDate.toISOString().split('T')[0];
                insertedDate = newDate.toISOString().split('T')[0];
                id = assignment.id;
            }
            return assignment;
        });

        // increment dates if required
        const updateDates = newAssignment.map((assignment) => {
            if (assignment.id != id) {
                if (draggableId < assignment.date) {
                    if (insertedDate >= assignment.date) {
                        const newDate = new Date();
                        newDate.setDate(new Date(assignment.date).getDate() - 1);
                        assignment.date = newDate.toISOString().split('T')[0];
                    }
                } else {
                    if (insertedDate <= assignment.date) {
                        const newDate = new Date();
                        newDate.setDate(new Date(assignment.date).getDate() + 1);
                        assignment.date = newDate.toISOString().split('T')[0];
                    }
                }
            }
            return assignment;
        });

        console.log(updateDates);
        setAssignments(updateDates);
    };


    return (
        <Draggable draggableId={'test'} index={0}>
            {(draggableProvided) => (
                <div
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                    className={styles.full}
                >
                    <div {...draggableProvided.dragHandleProps}
                        className={styles.route_scheduler_header}
                    >
                        route name
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className={styles.route_scheduler_container}>
                            <Droppable droppableId="test" type="task" direction='horizontal'>
                                {(droppableProvided) => (
                                    <div ref={droppableProvided.innerRef}
                                        {...droppableProvided.droppableProps}
                                        className={styles.drop_list}>
                                        {tasks.map((task, taskIndex) => {
                                            if (task.type == 0) {
                                                return (
                                                    <EmptyEntry key={taskIndex} onCreateClick={createTask} index={taskIndex} col={'name'}/>
                                                );
                                            } else {
                                                const nextOpen = taskIndex < interval-1 && tasks[taskIndex+1].type == 0;
                                                return (
                                                    <CalendarEntry key={taskIndex} onCreateClick={createTask} nextOpen={nextOpen} onRemoveClick={onRemoveClick} index={taskIndex} col={'name'} taskData={task}/>
                                                );
                                            }
                                        })}
                                        {droppableProvided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
                </div>
            )}
        </Draggable>
    );
}
