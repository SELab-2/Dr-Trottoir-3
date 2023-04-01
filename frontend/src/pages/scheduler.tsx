import dynamic from 'next/dynamic';

const DynamicSchedulerComponent = dynamic(() =>
    import('../containers/SchedulerPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function SchedulerPage() {
    return (
        <DynamicSchedulerComponent/>
    );
}
