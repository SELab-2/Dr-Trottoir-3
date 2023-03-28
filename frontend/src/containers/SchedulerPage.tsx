import SchedulesList from "@/components/elements/ScheduleListElement/ScheduleList";
import SchedulerSelect from '../components/elements/schedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/schedulerElements/SchedulerDetails';
import styles from './SchedulerPage.module.css';


export default function SchedulerPage() {
  return (
    <>
        <SchedulesList></SchedulesList>
        <div className={styles.full_calendar_flex_container}>
            <SchedulerSelect/>
            <SchedulerDetails/>
        </div>
    </>
  );
}
