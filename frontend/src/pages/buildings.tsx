import dynamic from 'next/dynamic';

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    return (
        <DynamicBuildingsComponent/>
    );
}
