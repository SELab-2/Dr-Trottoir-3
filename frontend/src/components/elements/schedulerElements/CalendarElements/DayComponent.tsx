import {memo} from 'react';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {ITask} from './Interfaces';
import {IColumn} from './Interfaces';
import styles from './DayComponent.module.css';
import TaskListComponent from './TaskList';

interface Props {
    column: IColumn;
    tasks: ITask[];
    index: number;
}

const DayComponent = ({column, tasks, index}: Props) => {
    return (
        <div className={styles.full_day}>
            <div className={styles.header}>
                {column.title}
            </div>
            <Droppable droppableId={column.id} type="task">
                {(droppableProvided, droppableSnapshot) => (
                    <div ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className={styles.task_list}>
                        <TaskListComponent tasks={tasks} />

                        {droppableProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
export default memo(DayComponent);
