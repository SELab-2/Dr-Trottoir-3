import React, {useState, useEffect} from 'react';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import DayComponent from './DayComponent';
import styles from './WeekComponent.module.css';
import {Backdrop} from '@mui/material';
import CreateActiveTaskForm from './CreateActiveTaskForm';
import {v4 as uuid} from 'uuid';
import Button from '@mui/material/Button';
import {User} from '@/api/models';
import {useSession} from 'next-auth/react';
import {Api, getDetail} from '@/api/api';

type schedulerProps = {
    users: any[],
    routes: any[],
    start: number,
    days: number,
}

export default function Scheduler({users, routes, start, days}: schedulerProps) {
    const [schedulerData, setSchedulerData] = useState(null);
    const [startDay, setStartDay] = useState<number>(start);
    const [editorOverlay, setEditorOverlay] = useState<boolean>(false);
    const [editorState, setEditorState] = useState({date: null, route: null, user: null});

    let user: User | undefined = undefined;
    const {data: session} = useSession();

    if (session) {
        // @ts-ignore
        // eslint-disable-next-line no-unused-vars
        const {data, error, isLoading} = getDetail(Api.UserDetail, session.userid);

        // @ts-ignore
        user = data;
    }

    if (!user) {
        return (<div>Loading...</div>);
    }


    // // load scheduler data
    // useEffect(() => {
    //     const weekData = {
    //         'tasks': {},
    //         'days': {},
    //         'dayOrder': [],
    //     };
    //
    //     for (let i: number = 0; i < days; i++) {
    //         const currentDate: string = new Date(new Date().setDate(startDay + i)).toISOString().split('T')[0];
    //
    //         // get task from api for current day
    //         // currently dummy data
    //         const currentDayTasks: any[] = [
    //             {id: uuid(), route: 'testroute0', user: 'testuser0'},
    //             {id: uuid() + i.toString(), route: 'testroute1', user: 'testuser1'},
    //         ];
    //
    //         currentDayTasks.forEach(function(task) {
    //             weekData.tasks[task.id] = task;
    //         });
    //
    //         // create new day
    //         weekData.dayOrder.push(currentDate);
    //         weekData.days[currentDate] = {
    //             id: currentDate,
    //             taskIds: [],
    //         };
    //
    //         currentDayTasks.forEach(function(task) {
    //             weekData.days[currentDate].taskIds.push(task.id);
    //         });
    //     }
    //     setSchedulerData(weekData);
    // }, [startDay]);

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


    const onEditClick = (id: string) => {
        console.log('edit');
        console.log(id);
    };

    const onRemoveClick = (id: string) => {
        console.log('remove');
        console.log(id);
        console.log(schedulerData.tasks[id]);
    };

    const onAddClick = (id: string) => {
        console.log('Add');
        console.log(id);
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
                open={editorOverlay}
                invisible={false}
            >
                <CreateActiveTaskForm
                    routes={routes}
                    users={users}
                    setOpen={setEditorOverlay}
                    addTask={addTask}
                    initState={editorState}/>
            </Backdrop>
        </div>
    );
}
