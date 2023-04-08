import TaskComponent from './Task';
import styles from './TaskList.module.css';

interface Props {
    tasks: any[];
    onEditClick: any;
    onRemoveClick: any;
}
export default function TaskList({tasks, onEditClick, onRemoveClick}: Props) {
    return (
        <div className={styles.full_list}>
            {tasks.map((task, index) => (
                <TaskComponent
                    key={task.id}
                    task={task}
                    index={index}
                    onEditClick={onEditClick}
                    onRemoveClick={onRemoveClick}
                />
            ))}
        </div>
    );
}
