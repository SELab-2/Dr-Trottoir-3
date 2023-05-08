import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {
    getLatestScheduleDefinitionsList,
    getLocationGroupsList,
    getScheduleDefinitionsList,
    useAuthenticatedApi,
} from '@/api/api';
import {LocationGroup, ScheduleDefinition} from '@/api/models';
import RouteTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/RouteTopBarComponent';
import RouteListButtonComponent
    from '@/components/elements/ListViewElement/ListButtonElements/RouteListButtonComponent';
import RouteIcon from '@mui/icons-material/Route';
import RouteDetail from '@/components/modules/routeDetail/RouteDetail';
import Head from 'next/head';
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';
import styles from '@/components/elements/ListViewElement/listView.module.css';


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
    const [selectedActive, setSelectedActive] = useState<string>('all');

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
    }, [session]);

    useEffect(() => {
        getLatestScheduleDefinitionsList(session, setAllRoutes);
    }, [session]);


    useEffect(() => {
        handleSearch(false);
    }, [session, selectedRegions, sorttype, selectedActive]);

    useEffect(() => {
        const element = document.getElementById(styles.scrollable);
        if (element !== null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [routes]);

    const handleSearch = (clear: boolean = false) => {
        let searchEntryOverwritten: string;
        if (clear) {
            searchEntryOverwritten = '';
        } else {
            searchEntryOverwritten = searchEntry;
        }
        let regionsFilter = '';
        selectedRegions.map((r) => {
            regionsFilter += r.id + ',';
        });
        if (selectedActive === 'newest') {
            getLatestScheduleDefinitionsList(session, setRoutes, {
                search: searchEntryOverwritten, ordering: sorttype,
                location_group__in: regionsFilter,
            });
        } else {
            getScheduleDefinitionsList(session, setRoutes, {
                search: searchEntryOverwritten, ordering: sorttype,
                location_group__in: regionsFilter,
            });
        }
    };

    const topBar = <RouteTopBarComponent
        sorttype={sorttype}
        setSorttype={setSorttype}
        selectedRegions={selectedRegions}
        setRegion={setSelectedRegions}
        allRegions={locationGroups ? locationGroups.data : []}
        amountOfResults={routes ? routes.data.length : 0}
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
        selectedActive={selectedActive}
        setSelectedActive={setSelectedActive}
        allRoutes={allRoutes ? allRoutes.data : []}
        handleSearch={handleSearch}
    />;

    return (
        <>
            <Head>
                <title>Routes</title>
            </Head>
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
                title={'Routes'}
                Icon={RouteIcon}
            >
                {current ? <RouteDetail scheduleDefinitionId={current}/> : <NoneSelected ElementName={'route'}/>}
            </ListViewComponent>
        </>
    );
}
