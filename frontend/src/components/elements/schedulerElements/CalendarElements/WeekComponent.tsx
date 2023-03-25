import styles from './WeekComponent.module.css';
import DayComponent from './DayComponent';


export default function WeekComponent() {
    return (
        <div className={styles.full_week}>
            <DayComponent/>
            <DayComponent/>
            <DayComponent/>
            <DayComponent/>
            <DayComponent/>
            <DayComponent/>
            <DayComponent/>
        </div>
    );
}
