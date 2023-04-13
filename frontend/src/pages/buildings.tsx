import dynamic from 'next/dynamic';
import BuildingDetail from "@/components/elements/buildingdetailElement/buildingDetail";

const DynamicBuildingsComponent = dynamic(() =>
    import('../containers/BuildingsPage'), {ssr: false}
);

export default function BuildingsPage() {
    return (
        <BuildingDetail id={1}/>
    );
}
