import React, {useState, useEffect} from 'react';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import DayComponent from './DayComponent';
import styles from './WeekComponent.module.css';
import {Backdrop} from '@mui/material';
import CreateActiveTaskForm from './CreateActiveTaskForm';
import {v4 as uuid} from 'uuid';
import Button from '@mui/material/Button';
import {Api, getList} from '@/api/api';

type schedulerProps = {
    users: any[],
    routes: any[],
    start: number,
    days: number,
}

export default function WeekComponent({users, routes, start, days}: schedulerProps) {
    const [schedulerData, setSchedulerData] = useState(null);
    const [startDay, setStartDay] = useState<number>(start);
    const [editorState, setEditorState] = useState({active: false, date: null, route: null, user: null});


    const data = getList(Api.ScheduleAssignments);
    console.log(data);


    // load scheduler data
    useEffect(() => {
        const weekData = {
            'tasks': {},
            'days': {},
            'dayOrder': [],
        };


        for (let i: number = 0; i < days; i++) {
            const currentDate: string = new Date(new Date().setDate(startDay + i)).toISOString().split('T')[0];

            // get task from api for current day
            // currently dummy data
            const currentDayTasks: any[] = [
                {id: uuid(), route: 'testroute0', user: 'testuser0'},
                {id: uuid() + i.toString(), route: 'testroute1', user: 'testuser1'},
            ];

            currentDayTasks.forEach(function(task) {
                weekData.tasks[task.id] = task;
            });

            // create new day
            weekData.dayOrder.push(currentDate);
            weekData.days[currentDate] = {
                id: currentDate,
                taskIds: [],
            };

            currentDayTasks.forEach(function(task) {
                weekData.days[currentDate].taskIds.push(task.id);
            });
        }
        setSchedulerData(weekData);
    }, [startDay]);

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

        const newSchedule = {...schedulerData};

        // remove from source day
        newSchedule.days[source.droppableId].taskIds.splice(source.index, 1);

        // add to destination day at correct index
        newSchedule.days[destination.droppableId].taskIds.splice(destination.index, 0, draggableId);

        setSchedulerData(newSchedule);
    };

    const addTask = (route, user, date) => {
        const newState = {...schedulerData};

        newState.tasks[uuid()] =
            {
                id: route.toString()+user.name.toString()+date,
                route: route.toString(),
                user: user.name.toString(),
            };

        newState.days[date.toUTCString()].taskIds.push(route.name.toString()+user.name.toString()+date.toString());

        setSchedulerData(newState);
    };


    const onEditClick = (date: string, id: string) => {
        console.log('edit');
        console.log(id);
    };

    const onRemoveClick = (date: string, id: string) => {
        const newScheduleData = {...schedulerData};
        delete newScheduleData.tasks[id];
        const taskIndex = newScheduleData.days[date].taskIds.indexOf(id, 0);
        newScheduleData.days[date].taskIds.splice(taskIndex, 1);
        setSchedulerData(newScheduleData);
    };

    const onAddClick = (date: string) => {
        console.log('Add');
        console.log(date);
    };

    return (
        <div className={styles.full_week}>
            <Button onClick={() => (setStartDay(startDay-7))}>previous</Button>
            <Button onClick={() => (setStartDay(startDay+7))}>next</Button>
            <DragDropContext onDragEnd={onDragEnd}>
                {schedulerData != null && schedulerData.dayOrder.map((dayId) => {
                    const day = schedulerData.days[dayId];
                    const tasks = day.taskIds.map((taskId) => schedulerData.tasks[taskId]);
                    return (
                        <DayComponent
                            key={day.id}
                            date={day.id}
                            tasks={tasks}
                            onAddClick={onAddClick}
                            onEditClick={onEditClick}
                            onRemoveClick={onRemoveClick}
                        />
                    );
                })}
            </DragDropContext>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={editorState.active}
                invisible={false}
            >
                <CreateActiveTaskForm
                    routes={routes}
                    users={users}
                    setEditorState={setEditorState}
                    addTask={addTask}
                    editorState={editorState}/>
            </Backdrop>

        </div>
    );
}
