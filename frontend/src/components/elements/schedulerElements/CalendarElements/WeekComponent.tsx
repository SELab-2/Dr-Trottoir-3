import React, {useState, memo} from 'react';
import type {NextPage} from 'next';
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import DayComponent from './DayComponent';
import {IData} from './Interfaces';
import styles from './WeekComponent.module.css';

const weekData = {
    tasks: {
        'task-1': {id: 'task-1', content: '1'},
        'task-2': {id: 'task-2', content: '2'},
        'task-3': {id: 'task-3', content: '3'},
        'task-4': {id: 'task-4', content: '4'},
    },

    days: {
        'day1': {
            id: 'day1',
            title: 'maandag',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
        'day2': {
            id: 'day2',
            title: 'dinsdag',
            taskIds: [],
        },
        'day3': {
            id: 'day3',
            title: 'woensdag',
            taskIds: [],
        },
        'day4': {
            id: 'day4',
            title: 'donderdag',
            taskIds: [],
        },
        'day5': {
            id: 'day5',
            title: 'vrijdag',
            taskIds: [],
        },
        'day6': {
            id: 'day6',
            title: 'zaterdag',
            taskIds: [],
        },
        'day7': {
            id: 'day7',
            title: 'zondag',
            taskIds: [],
        },
    },
    // Facilitate reordering of the columns
    dayOrder: ['day1', 'day2', 'day3', 'day4', 'day5', 'day6', 'day7'],
};


const WeekComponent: NextPage = () => {
    const [state, setState] = useState<IData>(weekData);


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

        const newState = {...state};

        // remove from source day
        newState.days[source.droppableId].taskIds.splice(source.index, 1);

        // add to destination day at correct index
        newState.days[destination.droppableId].taskIds.splice(destination.index, 0, draggableId);

        setState(newState);
    };

    return (
        <div className={styles.full_week}>
            <DragDropContext onDragEnd={onDragEnd}>
                {state.dayOrder.map((columnId, index) => {
                    const column = state.days[columnId];
                    const tasks = column.taskIds.map(
                        (taskId) => state.tasks[taskId]
                    );
                    return (
                        <DayComponent
                            key={column.id}
                            column={column}
                            tasks={tasks}
                            index={index}
                        />
                    );
                })}
            </DragDropContext>
        </div>
    );
};


export default memo(WeekComponent);
