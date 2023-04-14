import dynamic from 'next/dynamic';

const DynamicLogoutComponent = dynamic(() =>
    import('../containers/LogoutPage'), {ssr: false}
);

// eslint-disable-next-line require-jsdoc
export default function LogoutPage() {
    return (
        <DynamicLogoutComponent/>
    );
}
