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
import Head from 'next/head';
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';

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
        getBuildingsList(session, setBuildings, {location_group__in: selectedRegions.map((e) => e.id).join(',')});
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


    return (
        <>
            <Head>
                <title>Gebouwen</title>
            </Head>
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
                {current ? <BuildingDetail id={current}/> : <NoneSelected ElementName={'gebouw'}/>}
            </ListViewComponent>
        </>
    );
}
