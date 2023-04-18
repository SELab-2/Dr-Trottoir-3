import styles from './CalendarEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {IconButton} from '@mui/material';
import {memo, useEffect, useState} from 'react';
import Router from 'next/router';
import {getScheduleWorkEntriesList, useAuthenticatedApi} from '@/api/api';
import {ScheduleWorkEntry} from '@/api/models';
import {useSession} from 'next-auth/react';

type calendarEntryProps = {
    index: number,
    scheduleDefinitionId: number,
    scheduleAssignment: any,
    onRemoveClick: any,
    nextOpen: boolean,
    onCreateClick: any,
}

function CalendarEntry(props: calendarEntryProps) {
    const {data: session} = useSession();
    const [hover, setHover] = useState(false);
    const [workEntries, setWorkEntries] = useAuthenticatedApi<ScheduleWorkEntry[]>();


    useEffect(() => {
        getScheduleWorkEntriesList(
            session,
            setWorkEntries,
            {schedule_assignment: props.scheduleAssignment.id}
        );
    }, [props.scheduleAssignment]);


    return (
        <Draggable draggableId={props.scheduleAssignment.id.toString()} index={props.index}>
            {(draggableProvided, snapshot) => {
                const handle = workEntries?.data.length == 0 ? {...draggableProvided.dragHandleProps} : undefined;
                return (
                    <div
                        onMouseOver={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        {...draggableProvided.draggableProps}
                        {...handle}
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
                            style={workEntries?.data.length != 0 ? {backgroundColor: 'grey'} : {}}
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
                                        onClick={() => {
                                            Router.push('/users/' + props.scheduleAssignment.id,
                                                undefined,
                                                {shallow: true}).then();
                                        }} >
                                        <InfoRoundedIcon className={styles.icon}/>
                                    </IconButton> : undefined
                                }
                            </div>
                            <div>
                                {(!props.scheduleAssignment.linkRight ||
                            snapshot.isDragging ||
                            hover) &&
                            workEntries?.data.length == 0 ?
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
                                            props.scheduleAssignment.user.id))}
                                    >
                                        <AddRoundedIcon className={styles.icon}/>
                                    </IconButton> : undefined
                                }
                            </div>
                        </div>
                    </div>
                );
            }}
        </Draggable>
    );
}


export default memo(CalendarEntry);
