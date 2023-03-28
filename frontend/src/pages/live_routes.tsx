import dynamic from 'next/dynamic';

const DynamicLiveRoutesComponent = dynamic(() =>
    import('../containers/LiveRoutesPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LiveRoutesPage() {
    return (
        <DynamicLiveRoutesComponent/>
    );
}
