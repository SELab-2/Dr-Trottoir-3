import NavBar from '../components/elements/navbarElement/navbar';
import SchedulerList from '../components/elements/scheduler/scheduler_select';
import dynamic from 'next/dynamic';

const SchedulerDetails = dynamic(() => import('../components/elements/scheduler/scheduler_details'), {
  ssr: false,
});


// eslint-disable-next-line new-cap
// eslint-disable-next-line require-jsdoc
export default function Scheduler() {
  return (
    <>
      <NavBar>
        <SchedulerList>
          <SchedulerDetails/>
        </SchedulerList>
      </NavBar>
    </>
  );
}
