import {useRouter} from 'next/router';
import ActiveRouteComponent from '@/components/elements/activeRoute/ActiveRouteComponent';

export default function ActiveRouteDetailPage() {
    const router = useRouter();
    const {id} = router.query;

    return (
        id ?
            <ActiveRouteComponent
                scheduleAssignmentId={Number.parseInt(typeof id === 'string' ? id : id[0])}
            /> : <>Please select a valid schedule assignment.</>
    );
}
