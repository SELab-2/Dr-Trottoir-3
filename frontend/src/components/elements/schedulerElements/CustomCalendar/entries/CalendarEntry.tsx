import styles from './CalendarEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {IconButton} from '@mui/material';
import {useState} from 'react';

type calendarEntryProps = {
    index: number,
    scheduleDefinitionId: number,
    scheduleAssignment: any,
    onRemoveClick: any,
    nextOpen: boolean,
    onCreateClick: any,
}

export default function CalendarEntry(props: calendarEntryProps) {
    const [hover, setHover] = useState(false);

    return (
        <Draggable draggableId={props.scheduleAssignment.id.toString()} index={props.index}>
            {(draggableProvided, snapshot) => (
                <div
                    onMouseOver={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    id={((!props.scheduleAssignment.linkLeft && !props.scheduleAssignment.linkRight) ||
                        snapshot.isDragging ? styles.padding_full : undefined) ||
                        (!props.scheduleAssignment.linkLeft ? styles.padding_left : undefined) ||
                        (!props.scheduleAssignment.linkRight ? styles.padding_right : undefined)}
                    className={styles.full}
                >
                    <div
                        id={((!props.scheduleAssignment.linkLeft && !props.scheduleAssignment.linkRight) ||
                            snapshot.isDragging ? styles.link_none : undefined) ||
                            (!props.scheduleAssignment.linkLeft ? styles.link_left : undefined) ||
                            (!props.scheduleAssignment.linkRight ? styles.link_right : undefined)}
                        className={styles.inner}
                    >
                        <div className={styles.content}>
                            <p className={styles.text}>
                                {
                                    (!props.scheduleAssignment.linkLeft || snapshot.isDragging) &&
                                    props.scheduleAssignment.user ?
                                        (props.scheduleAssignment.user.first_name +
                                            ' ' +
                                            props.scheduleAssignment.user.last_name) : ''
                                }
                            </p>
                        </div>
                        <div>
                            {!props.scheduleAssignment.linkRight || snapshot.isDragging || hover ?
                                <IconButton
                                    size='small'
                                    className={styles.icon}
                                    onClick={()=>(props.onRemoveClick(props.scheduleAssignment.id))}
                                >
                                    <CloseRoundedIcon className={styles.icon}/>
                                </IconButton> : undefined
                            }
                        </div>
                        <div>
                            {!props.scheduleAssignment.linkRight && props.nextOpen ?
                                <IconButton
                                    size='small'
                                    className={styles.icon}
                                    onClick={()=>(props.onCreateClick(
                                        props.scheduleDefinitionId,
                                        props.index+1,
                                        props.scheduleAssignment))}
                                >
                                    <AddRoundedIcon className={styles.icon}/>
                                </IconButton> : undefined
                            }
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
}
