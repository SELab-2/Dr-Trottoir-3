import styles from './CalendarEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {IconButton} from '@mui/material';
import {useState} from 'react';

type calendarEntryProps = {
    index: number,
    col: string,
    taskData: any,
    onRemoveClick: any,
    nextOpen: boolean,
    onCreateClick: any,
}

export default function CalendarEntry({index, col, taskData, onRemoveClick, onCreateClick, nextOpen}: calendarEntryProps) {
    const [hover, setHover] = useState(false);

    return (
        <Draggable draggableId={taskData.date} index={index}>
            {(draggableProvided, snapshot) => (
                <div
                    onMouseOver={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    id={((!taskData.linkLeft && !taskData.linkRight) || snapshot.isDragging ? styles.padding_full : undefined) ||
                        (!taskData.linkLeft ? styles.padding_left : undefined) ||
                        (!taskData.linkRight ? styles.padding_right : undefined)}
                    className={styles.full}
                >
                    <div
                        id={((!taskData.linkLeft && !taskData.linkRight) || snapshot.isDragging ? styles.link_none : undefined) ||
                            (!taskData.linkLeft ? styles.link_left : undefined) ||
                            (!taskData.linkRight ? styles.link_right : undefined)}
                        className={styles.inner}
                    >
                        <div className={styles.content}>
                            <p>{!taskData.linkLeft || snapshot.isDragging ? taskData.user : ''}</p>
                        </div>
                        <div>
                            {!taskData.linkRight || snapshot.isDragging || hover ?
                                <IconButton size='small' className={styles.icon} onClick={()=>(onRemoveClick(taskData.id))}>
                                    <CloseRoundedIcon />
                                </IconButton> : undefined
                            }
                        </div>
                        <div>
                            {!taskData.linkRight && nextOpen ?
                                <IconButton size='small' className={styles.icon} onClick={()=>(onCreateClick(index+1, taskData))}>
                                    <AddRoundedIcon />
                                </IconButton> : undefined
                            }
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
