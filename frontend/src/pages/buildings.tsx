import dynamic from 'next/dynamic';

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function BuildingsPage() {
    return (
        <DynamicBuildingsComponent/>
    );
}
