import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import BuildingListButtonComponent
    from '@/components/elements/ListViewElement/ListButtonElements/BuildingListButtonComponent';
import BuildingTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/BuildingTopBarComponent';
import BuildingDetail from '@/components/elements/BuildingDetailElement/BuildingDetail';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {getBuildingsList, getLocationGroupsList, useAuthenticatedApi} from '@/api/api';
import {Building, LocationGroup} from '@/api/models';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';

export default function BuildingsPage() {
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
        getBuildingsList(session, setBuildings, {
            ordering: sorttype,
            search: searchEntry,
            location_group__in: selectedRegions.map((e) => e.id).join(',')});
    }, [session, selectedRegions, sorttype]);

    const handleSearch = (clear: boolean = false) => {
        let searchEntryOverwritten: string;
        if (clear) {
            searchEntryOverwritten = '';
        } else {
            searchEntryOverwritten = searchEntry;
        }
        getBuildingsList(session, setBuildings, {
            ordering: sorttype,
            search: searchEntryOverwritten,
            location_group__in: selectedRegions.map((e) => e.id).join(',')});
    };

    const topBar = <BuildingTopBarComponent
        sorttype={sorttype}
        setSorttype={setSorttype}
        selectedRegions={selectedRegions}
        setRegion={setSelectedRegions}
        allRegions={locationGroups ? locationGroups.data : []}
        amountOfResults={buildings ? buildings.data.length : 0}
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
        handleSearch={handleSearch}
    />;


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
                title={'Gebouwen'}
                Icon={ApartmentRoundedIcon}
            >
                {current ? <BuildingDetail id={current}/> : <div>None selected</div>}
            </ListViewComponent>
        </>
    );
}
