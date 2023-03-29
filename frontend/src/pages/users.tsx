import dynamic from 'next/dynamic';

const DynamicRoutesComponent = dynamic(() =>
    import('../containers/UsersPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function UsersPage() {
    return (
        <DynamicRoutesComponent/>
    );
}
