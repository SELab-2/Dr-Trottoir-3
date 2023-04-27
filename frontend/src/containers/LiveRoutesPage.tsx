import {useSession} from 'next-auth/react';
import {
    getLocationGroupsList, getScheduleAssignmentsList,
    getScheduleDefinitionsList, getScheduleWorkEntriesList,
    getUsersList,
    useAuthenticatedApi,
} from '@/api/api';
import {LocationGroup, ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry, User} from '@/api/models';
import React, {useEffect, useState} from 'react';
import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import LiveRoutesElement from '@/components/elements/LiveRoutesElement/LiveRoutesElement';
import LiveRouteTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/LiveRouteTopBarComponent';
import ActiveRouteListButtonComponent
    from '@/components/elements/ListViewElement/ListButtonElements/ActiveRouteListButtonComponent';

import styles from './containerStyles.module.css';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import NoneSelected from "@/components/elements/ListViewElement/NoneSelectedComponent";

// eslint-disable-next-line require-jsdoc
export default function LiveRoutesPage() {
    const {data: session} = useSession();
    const [assignments, setAssignments] = useAuthenticatedApi<ScheduleAssignment[]>();
    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();
    const [definitions, setDefinitions] = useAuthenticatedApi<ScheduleDefinition[]>();
    const [workEntries, setWorkEntries] = useAuthenticatedApi<ScheduleWorkEntry[]>();
    const [students, setStudents] = useAuthenticatedApi<User[]>();

    const [searchEntry, setSearchEntry] = React.useState('');
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype, setSorttype] = React.useState('schedule_definition__name');
    const [selectedRegions, setSelectedRegions] = React.useState<LocationGroup[]>([]);

    useEffect(() => {
        getScheduleDefinitionsList(session, setDefinitions, {is_active: true});
        getLocationGroupsList(session, setLocationGroups);
        // TODO: mockdata currently only has AR but would make more sense to be DE
        getScheduleWorkEntriesList(session, setWorkEntries, {entry_type: 'AR'});
        getUsersList(session, setStudents, {student__id__gt: 0});
    }, [session]);

    useEffect(() => {
        let regionsFilter = '';
        selectedRegions.map((r) => {
            regionsFilter+=r.id + ',';
        });
        const todayDate = new Date();
        const today = todayDate.toISOString().split('T')[0];
        getScheduleAssignmentsList(session, setAssignments, {
            ordering: sorttype,
            schedule_definition__location_group__in: regionsFilter,
            assigned_date: today,
        });
    }, [session, sorttype, selectedRegions]);


    useEffect(() => {
        const element = document.getElementById(styles['scroll_style']);
        if (element !== null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [sorttype, selectedRegions]);

    const filterLiveRoutes = (data: any[], search: string) => {
        if (!search) {
            return data;
        } else {
            search = search.toLowerCase();
            return data.filter((d) => d.toLowerCase().replace(/ /g, '').includes(search));
        }
    };


    if (assignments && definitions && students && workEntries && locationGroups) {
        const mappedAssignments = assignments.data.map((e) => {
            const student = students.data.filter((user) => user.id === e.user)[0];
            const definition = definitions.data.filter((def) => def.id === e.schedule_definition)[0];
            return {
                id: e.id,
                name: definition.name,
                totalBuildings: definition.buildings.length,
                buildingsDone: workEntries.data.filter((e) => e.schedule_assignment === e.id).length,
                location_group: locationGroups.data.filter((e) => e.id === definition.location_group)[0].name,
                student: student.first_name + ' .' + student.last_name[0].toUpperCase(),
            };
        });

        const filteredLiveRoutes = {
            data: filterLiveRoutes(mappedAssignments, searchEntry),
            status: 200,
            success: true,
        };

        const topBar = <LiveRouteTopBarComponent
            sorttype={sorttype}
            setSorttype={setSorttype}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            allRegions={locationGroups ? locationGroups.data : []}
            amountOfResults={filteredLiveRoutes ? filteredLiveRoutes.data.length : 0}
            searchEntry={searchEntry}
            setSearchEntry={setSearchEntry}
        />;

        return (
            <>
                <ListViewComponent
                    listData={filteredLiveRoutes}
                    setListData={setAssignments}
                    locationGroups={locationGroups}
                    selectedRegions={selectedRegions}
                    setSelectedRegions={setSelectedRegions}
                    current={current}
                    setCurrent={setCurrent}
                    ListItem={ActiveRouteListButtonComponent}
                    TopBar={topBar}
                    title={'Live routes'}
                    Icon={SensorsRoundedIcon}
                >
                    {current ? <LiveRoutesElement id={current}/> : <NoneSelected ElementName={"route"}/>}
                </ListViewComponent>
            </>
        );
    } else {
        return (<div>error</div>);
    }
}
