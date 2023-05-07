import SchedulerTopBarComponent from '../components/elements/ListViewElement/TopBarElements/SchedulerTopBarComponent';
import SchedulerDetails from '../components/elements/SchedulerElements/SchedulerDetails';
import styles from './schedulerPage.module.css';
import React, {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {
    getBuildingsList,
    getLocationGroupsList, getScheduleDefinitionsList,
    getUsersList,
    useAuthenticatedApi,
} from '@/api/api';
import {Building, LocationGroup, ScheduleDefinition, User} from '@/api/models';


export default function SchedulerPage() {
    const {data: session} = useSession();

    const [selectedRegion, setSelectedRegion] = React.useState<LocationGroup>();
    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();
    const [scheduleDefinitions, setScheduleDefinitions] = useAuthenticatedApi<ScheduleDefinition[]>();
    const [buildings, setBuildings] = useAuthenticatedApi<Building[]>();
    const [users, setUsers] = useAuthenticatedApi<User[]>();

    const currentDay: Date = new Date();
    const [first, setFirst] = useState<number>(currentDay.getDate() - currentDay.getDay());
    const interval: number = 7;

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
    }, [session]);

    useEffect(() => {
        if(locationGroups && selectedRegion == undefined) {
            setSelectedRegion(locationGroups.data.at(0))
        }
    }, [setLocationGroups])

    useEffect(() => {
        if (locationGroups) {
            if(selectedRegion) {
                getScheduleDefinitionsList(session, setScheduleDefinitions, {location_group: selectedRegion?.id});
            }
        }
    }, [selectedRegion, session]);

    console.log(scheduleDefinitions)

    useEffect(() => {
        if (selectedRegion) {
            getBuildingsList(session, setBuildings, {location_group: selectedRegion?.id});
        }
    }, [selectedRegion, session]);

    useEffect(() => {
        if (locationGroups) {
            getUsersList(session, setUsers, {location_group: selectedRegion?.id});
        }
    }, [selectedRegion, session]);


    const nextWeek = () => {
        setFirst(first + interval);
    };

    const prevWeek = () => {
        setFirst(first - interval);
    };

    if (locationGroups && selectedRegion) {
        return (
            <div className={styles.full_calendar_flex_container}>
                <SchedulerTopBarComponent selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} allRegions={locationGroups.data} nextWeek={nextWeek} prevWeek={prevWeek}/>
                <SchedulerDetails
                    start={first}
                    scheduleDefinitions={scheduleDefinitions}
                    users={users}
                    buildings={buildings}
                    interval={interval}/>
            </div>
        );
    } else {
        return (<div>error</div>);
    }
}
