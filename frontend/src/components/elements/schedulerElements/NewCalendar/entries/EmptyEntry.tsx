import styles from './EmptyEntry.module.css';
import {Draggable} from 'react-beautiful-dnd';

type calendarEntryProps = {
    index: number,
    col: string,
    onCreateClick: any,
}

export default function EmptyEntry({index, col, onCreateClick}: calendarEntryProps) {
    return (
        <Draggable draggableId={col+index.toString()} index={index}>
            {(draggableProvided) => (
                <div
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                    className={styles.test}
                    onClick={() => (onCreateClick(index, undefined))}
                >
                </div>
            )}
        </Draggable>
    );
}
