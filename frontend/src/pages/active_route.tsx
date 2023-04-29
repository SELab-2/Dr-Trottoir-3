import ActiveRouteComponent from '@/components/elements/activeRoute/ActiveRouteComponent';

export default function ActiveRoutesPage(): JSX.Element {
    // TODO this page is the mobile active route for the students. This page should contain a way for
    //  the students to navigate to the schedule assignments that are coming up. Additionally, when
    //  implementing this page, remove the div in components/elements/activeRoute/ActiveRouteComponent.tsx
    //  at line 389

    // The id of the schedule assignment
    const scheduleAssignmentId = 1;

    return (
        <ActiveRouteComponent scheduleAssignmentId={scheduleAssignmentId}></ActiveRouteComponent>
    );
}
