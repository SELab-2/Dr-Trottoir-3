import BuildingDetail from '@/components/elements/buildingdetailElement/buildingDetail';

export default function BuildingsPage() {
    return (
        <div style={{height: '100%'}}>
            <h1 style={{color: 'black'}}>BUILDINGS</h1>
            <br/>
            <div><BuildingDetail id={1}/></div>
        </div>
    );
}
