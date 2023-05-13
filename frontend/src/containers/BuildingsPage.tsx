import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import BuildingListButtonComponent
    from '@/components/elements/ListViewElement/ListButtonElements/BuildingListButtonComponent';
import BuildingTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/BuildingTopBarComponent';
import BuildingDetail from '@/components/elements/BuildingDetailElement/BuildingDetail';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {getBuildingsList, getLocationGroupsList, getUsersList, useAuthenticatedApi} from '@/api/api';
import {Building, LocationGroup, User} from '@/api/models';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import styles from '@/components/elements/ListViewElement/listView.module.css';

export default function BuildingsPage() {
    const {data: session} = useSession();
    const [buildings, setBuildings] = useAuthenticatedApi<Building[]>();
    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();

    const [current, setCurrent] = useState<number | null>(null);
    const [selectedRegions, setSelectedRegions] = useState<LocationGroup[]>([]);
    const [searchEntry, setSearchEntry] = useState('');
    const [sorttype, setSorttype] = useState('name');

    const [allSyndici, setAllSyndici] = useAuthenticatedApi<User[]>();

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
        getUsersList(session, setAllSyndici, {syndicus__id__gt: 0});
    }, [session]);

    useEffect(() => {
        handleSearch(false);
    }, [session, selectedRegions, sorttype]);

    useEffect(() => {
        const element = document.getElementById(styles.scrollable);
        if (element !== null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [buildings]);

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
        allSyndici={allSyndici ? allSyndici.data: []}
    />;

    const [buildingWidget, setBuildingWidget] = useState(<LoadingElement />);

    useEffect(() => {
        setBuildingWidget(<LoadingElement />);
        if (current) {
            setBuildingWidget(<BuildingDetail id={current}/>);
        }
    }, [current]);

    if (buildings && locationGroups && allSyndici) {
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
                    {current ? buildingWidget : <NoneSelected ElementName={'gebouw'}/>}
                </ListViewComponent>
            </>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}
