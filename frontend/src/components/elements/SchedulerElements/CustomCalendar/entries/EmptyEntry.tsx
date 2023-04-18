import styles from './EmptyEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';
import Button from '@mui/material/Button';
import {memo} from 'react';

type calendarEntryProps = {
    index: number,
    scheduleDefinitionId: number,
    onCreateClick: any,
}

function EmptyEntry(props: calendarEntryProps) {
    return (
        <Draggable
            draggableId={'empty' + props.index.toString() + props.scheduleDefinitionId.toString()}
            index={props.index}>
            {(draggableProvided, snapshot) => (
                <div
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    className={styles.test}
                >
                    <Button
                        className={styles.inner}
                        onClick={() => (props.onCreateClick(props.scheduleDefinitionId, props.index))}
                    >
                    </Button>
                </div>
            )}
        </Draggable>
    );
}

export default memo(EmptyEntry);
