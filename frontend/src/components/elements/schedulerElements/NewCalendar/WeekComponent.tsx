import React, {useState, useEffect} from 'react';
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd';
import styles from './WeekComponent.module.css';
import {v4 as uuid} from 'uuid';
import Button from '@mui/material/Button';
import RouteListComponent from './RouteListComponent';
import DayHeader from '@/components/elements/schedulerElements/NewCalendar/DayHeader';

type schedulerProps = {
    users: any[],
    routes: any[],
    setRoutes: any,
    start: number,
    interval: number,
}

export default function WeekComponent({users, routes, setRoutes, start, interval}: schedulerProps) {
    const [schedulerData, setSchedulerData] = useState(null);
    // const [showScheduleDefinitions, setShowScheduleDefinitions] = useState([]);
    const [, setScheduleDefenitionsSelector] = useState(false);


    // load scheduler data
    useEffect(() => {
        const weekData = {
            'tasks': {},
            'routes': {},
            'routeOrder': [],
        };


        for (let i: number = 0; i < interval; i++) {
            // get task from api for current day
            // currently dummy data
            const currentDayTasks: any[] = [
                {id: uuid(), route: 1, user: 5},
                {id: uuid() + i.toString(), route: 2, user: 6},
            ];

            currentDayTasks.forEach(function(task) {
                weekData.tasks[task.id] = task;
            });

            // add task to correct route
            currentDayTasks.forEach((task) => {
                if (task.route in weekData.routes) {
                    weekData.routes[task.route].taskIds.push(task.id);
                } else {
                    weekData.routeOrder.push(task.route);
                    weekData.routes[task.route] = {id: task.route, taskIds: [task.id]};
                }
            });
        }

        // update show schedule definitions
        const newSchedule = routes.map((route) => {
            if (weekData.routeOrder.indexOf(route.id) > -1) {
                route.active=true;
            }
            return route;
        });

        setRoutes(newSchedule);
        setSchedulerData(weekData);
    }, [routes]);


    const onDragEnd = (result: DropResult) => {

    };


    return (
        <div className={styles.full_week}>
            <div className={styles.calendar_header_container}>
                <div className={styles.calendar_header_task}>
                    <Button className={styles.add_route_button} onClick={() => (setScheduleDefenitionsSelector(true))}></Button>
                </div>
                <div className={styles.calendar_header_days}>
                    {Array.from(Array(interval).keys()).map((dayId) => {
                        const date = new Date(new Date().setDate(start + dayId)).toISOString().split('T')[0];
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
                    <Droppable droppableId={'route-table'} type='column'>
                        {(droppableProvided) => (
                            <div ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                className={styles.row_container}>
                                {/* {schedulerData != null && schedulerData.routeOrder.map((routeId, index) => {*/}
                                {/*    const route = routes[routeId];*/}
                                {/*    return (*/}
                                {/*        <RouteListComponent start={start} interval={interval} index={index} key={route.id} route={route} details={schedulerData}/>*/}
                                {/*    );*/}
                                {/* })}*/}
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                <RouteListComponent start={'2023-04-09'} interval={interval} index={0} route={null} details={schedulerData}/>
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
}

