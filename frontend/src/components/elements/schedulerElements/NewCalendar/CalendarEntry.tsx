import styles from './CalendarEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';

type calendarEntryProps = {
    index: number,
    col: string,
}

export default function CalendarEntry({index, col}: calendarEntryProps) {
    return (
        <Draggable draggableId={col + index.toString()} index={index}>
            {(draggableProvided) => (
                <div
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    className={styles.test}
                >
                </div>
            )}
        </Draggable>
    );
}
