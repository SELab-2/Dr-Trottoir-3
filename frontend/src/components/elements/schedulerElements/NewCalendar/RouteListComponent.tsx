import styles from './ReouteListComponent.module.css';
import {Draggable, Droppable} from 'react-beautiful-dnd';
import CalendarEntry from '@/components/elements/schedulerElements/NewCalendar/CalendarEntry';
import DayHeader from "@/components/elements/schedulerElements/NewCalendar/DayHeader";
import React from "react";

type routeListComponentProps = {
    index: number,
    start: number,
    route: any,
    details: any,
    interval: number
}

export default function RouteListComponent({index, start, interval, route, details}: routeListComponentProps) {
    return (
        <Draggable draggableId={route.name} index={index}>
            {(draggableProvided) => (
                <div
                    {...draggableProvided.draggableProps}
                    ref={draggableProvided.innerRef}
                    className={styles.full}
                >
                    <div {...draggableProvided.dragHandleProps}
                        className={styles.route_scheduler_header}
                    >
                        {route.name}
                    </div>
                    <div className={styles.route_scheduler_container}>
                        <Droppable droppableId={route.name} type="task" direction='horizontal'>
                            {(droppableProvided) => (
                                <div ref={droppableProvided.innerRef}
                                    {...droppableProvided.droppableProps}
                                    className={styles.drop_list}>
                                    {Array.from(Array(interval).keys()).map((dayId, index) => {
                                        const date = new Date(new Date().setDate(start + dayId)).toISOString().split('T')[0];
                                        if(details.tasks[route.taskIds])
                                        return (
                                            <CalendarEntry index={index} />
                                        );
                                    })}
                                    {droppableProvided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
