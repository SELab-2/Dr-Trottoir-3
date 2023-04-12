import styles from './EmptyEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';
import {memo} from 'react';

type calendarEntryProps = {
    index: number,
    scheduleDefinitionId: number,
    onCreateClick: any,
}

export default function EmptyEntry(props: calendarEntryProps) {
    return (
        <Draggable draggableId={props.scheduleDefinitionId.toString() + props.index.toString()} index={props.index}>
            {(draggableProvided) => (
                <div
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    className={styles.test}
                    onClick={() => (props.onCreateClick(props.scheduleDefinitionId, props.index, undefined))}
                >
                    <div className={styles.inner}/>
                </div>
            )}
        </Draggable>
    );
}
