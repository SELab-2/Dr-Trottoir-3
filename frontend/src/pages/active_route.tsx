import ActiveRouteComponent from '@/components/elements/activeRoute/ActiveRouteComponent';

export default function ActiveRoutesPage(): JSX.Element {
    // The id of the schedule assignment
    // TODO this should be set through the url
    const scheduleAssignmentId = 1;
    return (
        <ActiveRouteComponent id={scheduleAssignmentId}></ActiveRouteComponent>
    );
}
