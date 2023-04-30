import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';

const DynamicBuildingDetailComponent = dynamic(() =>
    import('../../components/elements/PublicBuildingPageElement/PublicBuildingPage'), {ssr: false}
);

export default function PublicBuildingPage() {
    const router = useRouter();
    const {uuid} = router.query;

    return (
        <>
            <DynamicBuildingDetailComponent id={uuid}/>
        </>
    );
}
