import SchedulerSelect from '../components/elements/schedulerElements/scheduler_select';
import SchedulerDetails from '../components/elements/schedulerElements/scheduler_details';

// eslint-disable-next-line require-jsdoc
export default function SchedulerPage() {
    return (
        <>
            <SchedulerSelect>
                <SchedulerDetails/>
            </SchedulerSelect>
        </>
    );
}
