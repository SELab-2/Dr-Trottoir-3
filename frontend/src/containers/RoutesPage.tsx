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
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
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
    const [reload, setReload] = React.useState(false);

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
    }, [session]);

    useEffect(() => {
        getLatestScheduleDefinitionsList(session, setAllRoutes);
    }, [session]);

    useEffect(() => {
        handleSearch(false, false);
    }, [session]);

    useEffect(() => {
        handleSearch(false);
    }, [selectedRegions, sorttype, selectedActive]);

    const handleSearch = (clear: boolean = false, scrollTop: boolean = true) => {
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

        const setRoutesList = (data: any) => {
            setRoutes(data);
            const element = document.getElementById(styles.scrollable);
            if (scrollTop && element !== null) {
                element.scrollTo({top: 0, behavior: 'smooth'});
            }
        };

        if (selectedActive === 'newest') {
            getLatestScheduleDefinitionsList(session, setRoutesList, {
                search: searchEntryOverwritten, ordering: sorttype,
                location_group__in: regionsFilter,
            });
        } else {
            getScheduleDefinitionsList(session, setRoutesList, {
                search: searchEntryOverwritten, ordering: sorttype,
                location_group__in: regionsFilter,
            });
        }
    };

    if(reload){
        getLatestScheduleDefinitionsList(session, setAllRoutes);
        getLocationGroupsList(session, setLocationGroups);
        handleSearch(false, false);
        setReload(false);
    }

    const topBar = <RouteTopBarComponent
        onAdd={() => setReload(true)}
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

    const [routeWidget, setRouteWidget] = useState(<LoadingElement />);

    const changeRouteElementWidget = () => {
        setRouteWidget(<LoadingElement/>);
        if (current) {
            setRouteWidget(<RouteDetail scheduleDefinitionId={current} updateList={(newSelected) => {
                handleSearch(false, false);
                setCurrent(newSelected);
            }}/>);
        }
    }

    useEffect( () => {
        changeRouteElementWidget();
    }, [current]);

    if (routes && allRoutes && locationGroups) {
        const mappedRoutes = filterHighestVersion(routes.data);

        const routesMappedData = {
            data: mappedRoutes,
            status: 200,
            success: true,
        };

        return (
            <ListViewComponent
                listData={routesMappedData}
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
                {current ? routeWidget : <NoneSelected ElementName={'route'}/>}
            </ListViewComponent>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}


export function filterHighestVersion(schedules: ScheduleDefinition[]): ScheduleDefinition[] {
    const filteredSchedules: { [key: string]: ScheduleDefinition } = {};

    schedules.forEach((schedule) => {
        // If this name has not been seen before, or if this version is higher than the previous highest
        if (!filteredSchedules[schedule.name] || filteredSchedules[schedule.name].version < schedule.version) {
            // Store this schedule as the highest version for this name
            filteredSchedules[schedule.name] = schedule;
        }
    });

    // Convert the object back to an array
    return Object.values(filteredSchedules);
}
