import dynamic from 'next/dynamic';

const DynamicRegisterComponent = dynamic(() =>
    import('../../containers/RegisterPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function RegisterPage() {
    return (
        <DynamicRegisterComponent/>
    );
}
