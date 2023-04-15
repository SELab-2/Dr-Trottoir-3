import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {getLocationGroupsList, getScheduleDefinitionsList, useAuthenticatedApi} from '@/api/api';
import {LocationGroup, ScheduleDefinition} from '@/api/models';
import RouteTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/RouteTopBarComponent';
import RouteListButtonComponent
    from '@/components/elements/ListViewElement/ListButtonElements/RouteListButtonComponent';


// eslint-disable-next-line require-jsdoc
export default function RoutesPage() {
    const {data: session} = useSession();
    const [routes, setRoutes] = useAuthenticatedApi<ScheduleDefinition[]>();
    const [allRoutes, setAllRoutes] = useAuthenticatedApi<ScheduleDefinition[]>();

    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();

    const [current, setCurrent] = useState<number | null>(null);
    const [selectedRegions, setSelectedRegions] = useState<LocationGroup[]>([]);
    const [searchEntry, setSearchEntry] = useState('');
    const [sorttype, setSorttype] = useState('name');
    const [selectedActive, setSelectedActive] = useState<number | null>(null);

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
    }, [session]);

    useEffect(() => {
        getLocationGroupsList(session, setAllRoutes);
    }, [session]);


    useEffect(() => {
        let regionsFilter = '';
        selectedRegions.map((r) => {
            regionsFilter+=r.id + ',';
        });
        getScheduleDefinitionsList(session, setRoutes, {search: searchEntry, ordering: sorttype,
            location_group__in: regionsFilter, is_active: selectedActive});
    }, [session, searchEntry, selectedRegions, sorttype, selectedActive]);


    const topBar = <RouteTopBarComponent
        sorttype={sorttype}
        setSorttype={setSorttype}
        selectedRegions={selectedRegions}
        setRegion={setSelectedRegions}
        allRegions={locationGroups ? locationGroups.data : []}
        amountOfResults={routes ? routes.data.length : 0}
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
        selectedActive={setSelectedActive}
        setSelectedActive={(e) => (e)}
        allRoutes={allRoutes ? allRoutes.data : []}
    />;

    return (
        <>
            <ListViewComponent
                listData={routes}
                setListData={setRoutes}
                locationGroups={locationGroups}
                selectedRegions={selectedRegions}
                setSelectedRegions={setSelectedRegions}
                current={current}
                setCurrent={setCurrent}
                ListItem={RouteListButtonComponent}
                TopBar={topBar}
            >
                TODO: ROUTE DETAILS HERE
            </ListViewComponent>
        </>
    );
}
