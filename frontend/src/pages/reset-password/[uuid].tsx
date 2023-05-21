import dynamic from 'next/dynamic';

const DynamicResetPasswordComponent = dynamic(() =>
    import('../../containers/ResetPasswordPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function ResetPasswordPage() {
    return (
        <DynamicResetPasswordComponent/>
    );
}
