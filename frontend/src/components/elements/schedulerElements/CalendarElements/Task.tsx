import {Draggable} from 'react-beautiful-dnd';
import styles from './Task.module.css';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {IconButton} from '@mui/material';

interface Props {
    task: any;
    index: number;
    onRemoveClick: any;
    onEditClick: any;
}

export default function Task({task, index, onRemoveClick, onEditClick}: Props) {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(draggableProvided) => (
                <div
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    className={styles.full}
                >
                    <div className={styles.drag_button}>
                        <div className={styles.left_container}>
                            <p>{task.route}</p>
                            <p>{task.user}</p>
                        </div>
                        <div className={styles.right_container}>
                            <IconButton size='small' className={styles.icon} onClick={()=>(onRemoveClick(task.id))}>
                                <DeleteOutlineRoundedIcon />
                            </IconButton>
                            <IconButton size="small"className={styles.icon} onClick={()=>(onEditClick(task.id))}>
                                <EditRoundedIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
