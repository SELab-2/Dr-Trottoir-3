import ActiveRouteComponent from '@/components/elements/activeRoute/ActiveRouteComponent';

export default function ActiveRoutesPage(props: {id: number}): JSX.Element {
    return (
        <ActiveRouteComponent id={props.id}></ActiveRouteComponent>
    );
}
