import dynamic from 'next/dynamic';

const DynamicLoginComponent = dynamic(() =>
    import('../containers/LoginPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LoginPage() {
    return (
        <DynamicLoginComponent/>
    );
}
