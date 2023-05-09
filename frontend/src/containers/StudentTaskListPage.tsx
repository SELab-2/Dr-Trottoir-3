import StudentTaskList from '@/components/elements/MobileStudentTaskListElement/StudentTaskListComponent';
import {useSession} from 'next-auth/react';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';

export default function StudentTaskListPage() {
    const {data: session} = useSession();

    if (session) {
        // @ts-ignore
        return <StudentTaskList userId={session.userid} />;
    } else {
        return (
            <LoadingElement/>
        );
    }
}
