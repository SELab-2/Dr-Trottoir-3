import {memo} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {ITask} from './Interfaces';
import styles from './Task.module.css';

interface Props {
    task: ITask;
    index: number;
}
function Task({task, index}: Props){
    return (
        <Draggable draggableId={task.id} index={index}>
            {(draggableProvided, draggableSnapshot) => (
                <div
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    className={styles.full}
                >
                    {task.content}
                </div>
            )}
        </Draggable>
    );
};
export default memo(Task);
