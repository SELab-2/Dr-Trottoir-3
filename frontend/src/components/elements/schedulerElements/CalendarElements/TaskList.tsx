import {memo} from 'react';
import {ITask} from './Interfaces';
import TaskComponent from './Task';
import styles from './TaskList.module.css';

interface Props {
    tasks: ITask[];
}
function TaskList({tasks}: Props) {
    return (
        <div className={styles.full_list}>
            {tasks.map((task: ITask, index) => (
                <TaskComponent key={task.id} task={task} index={index} />
            ))}
        </div>
    );
}
export default memo(TaskList);
