import styles from './EmptyEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';
import Button from '@mui/material/Button';

type calendarEntryProps = {
    index: number,
    scheduleDefinitionId: number,
    onCreateClick: any,
}

export default function EmptyEntry(props: calendarEntryProps) {
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
