import {Droppable} from 'react-beautiful-dnd';
import styles from './DayComponent.module.css';
import TaskListComponent from './TaskList';
import Button from '@mui/material/Button';

const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Props {
    date: string,
    tasks: any;
    onAddClick: any;
    onRemoveClick: any;
    onEditClick: any;
}

const DayComponent = ({date, tasks, onAddClick, onRemoveClick, onEditClick}: Props) => {

    const removeFromDay = (id: string) => {
        onRemoveClick(date, id);
    };

    const editOnDay = (id: string) => {
        onEditClick(date, id);
    };

    return (
        <div className={styles.full_day}>
            <div className={styles.header}>
                <p>{date}</p>
                <p>{weekday[new Date(date).getDay()]}</p>
                <Button onClick={() => onAddClick(date)}>Add New</Button>
            </div>
            <Droppable droppableId={date} type="task">
                {(droppableProvided) => (
                    <div ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className={styles.task_list}>
                        <TaskListComponent tasks={tasks} onRemoveClick={removeFromDay} onEditClick={editOnDay} />
                    </div>
                )}
            </Droppable>
        </div>
    );
};
export default DayComponent;
