import SchedulerSelect from '../components/elements/schedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/schedulerElements/SchedulerDetails';
import styles from './SchedulerPage.module.css';


export default function SchedulerPage() {
    return (
        <div className={styles.full_calendar_flex_container}>
            <SchedulerSelect/>
            <SchedulerDetails/>
        </div>
    );
}
