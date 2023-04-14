import {useSession} from "next-auth/react";
import {getBuildingsList, getLocationGroupsList, useAuthenticatedApi} from "@/api/api";
import {Building, LocationGroup} from "@/api/models";
import React, {useEffect, useState} from "react";
import BuildingTopBarComponent from "@/components/elements/ListViewElement/TopBarElements/BuildingTopBarComponent";
import ListViewComponent from "@/components/elements/ListViewElement/ListViewComponent";
import BuildingListButtonComponent
    from "@/components/elements/ListViewElement/ListButtonElements/BuildingListButtonComponent";
import BuildingDetail from "@/components/elements/buildingdetailElement/buildingDetail";

// eslint-disable-next-line require-jsdoc
export default function LiveRoutesPage() {
    const {data: session} = useSession();
    const [buildings, setBuildings] = useAuthenticatedApi<Building[]>();
    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();

    const [current, setCurrent] = useState<number | null>(null);
    const [selectedRegions, setSelectedRegions] = useState<LocationGroup[]>([]);
    const [searchEntry, setSearchEntry] = useState('');
    const [sorttype, setSorttype] = useState('name');

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
    }, [session]);

    useEffect(() => {
        getBuildingsList(session, setBuildings, {location_group: selectedRegions});
    }, [session, selectedRegions]);


    const topBar = <BuildingTopBarComponent
        sorttype={sorttype}
        setSorttype={setSorttype}
        selectedRegions={selectedRegions}
        setRegion={setSelectedRegions}
        allRegions={locationGroups ? locationGroups.data : []}
        amountOfResults={buildings ? buildings.data.length : 0}
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
    />;

    console.log(current);

    return (
        <>
            <ListViewComponent
                listData={buildings}
                setListData={setBuildings}
                locationGroups={locationGroups}
                selectedRegions={selectedRegions}
                setSelectedRegions={setSelectedRegions}
                current={current}
                setCurrent={setCurrent}
                ListItem={BuildingListButtonComponent}
                TopBar={topBar}
            >
                {current ? <BuildingDetail id={current}/> : <div>None selected</div>}
            </ListViewComponent>
        </>
    );
}
