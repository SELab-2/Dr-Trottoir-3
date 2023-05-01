import dynamic from 'next/dynamic';

const StudentTaskListPage = dynamic(() =>
    import('../containers/StudentTaskListPage'), {ssr: false}
);


export default function MySchedule() {
    return (
        <StudentTaskListPage />
    );
}
