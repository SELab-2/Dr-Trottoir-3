import dynamic from 'next/dynamic';

const DynamicRoutesComponent = dynamic(() =>
    import('../containers/RoutesPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function RoutesPage() {
    return (
        <DynamicRoutesComponent/>
    );
}
