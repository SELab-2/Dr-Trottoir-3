import {useSession} from 'next-auth/react';
import {
    getLatestScheduleDefinitionsList,
    getLocationGroupsList, getScheduleAssignmentsList,
    getScheduleWorkEntriesList,
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
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';

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

    const currentDay: Date = new Date();
    const [day, setDay] = useState<number>(currentDay.getDate());

    useEffect(() => {
        getLatestScheduleDefinitionsList(session, setDefinitions);
        getLocationGroupsList(session, setLocationGroups);
        // TODO: mockdata currently only has AR but would make more sense to be DE
        getScheduleWorkEntriesList(session, setWorkEntries, {entry_type: 'AR'});
        getUsersList(session, setStudents, {student__id__gt: 0});
    }, [session]);

    useEffect(() => {
        console.log(day);
        handleSearch(false);
    }, [session, sorttype, selectedRegions, day]);

    useEffect(() => {
        const element = document.getElementById(styles.scrollable);
        if (element !== null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [assignments]);

    const handleSearch = (clear: boolean = false) => {
        let searchEntryOverwritten: string;
        if (clear) {
            searchEntryOverwritten = '';
        } else {
            searchEntryOverwritten = searchEntry;
        }
        let regionsFilter = '';
        selectedRegions.map((r) => {
            regionsFilter+=r.id + ',';
        });
        const todayDate = new Date();
        todayDate.setDate(day);
        getScheduleAssignmentsList(session, setAssignments, {
            search: searchEntryOverwritten,
            ordering: sorttype,
            schedule_definition__location_group__in: regionsFilter,
            assigned_date: todayDate.toISOString().split('T')[0],
        });
    };

    useEffect(() => {
        const element = document.getElementById(styles['scroll_style']);
        if (element !== null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [sorttype, selectedRegions]);

    const [liveRouteWidget, setLiveRouteWidget] = useState(<LoadingElement />);

    useEffect(() => {
        setLiveRouteWidget(<LoadingElement />);
        if (current) {
            setLiveRouteWidget(<LiveRoutesElement id={current}/>);
        }
    }, [current]);

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
                student: student ? student.first_name + ' .' + student.last_name[0].toUpperCase() : '',
            };
        });

        const liveRoutesMapped = {
            data: mappedAssignments,
            status: 200,
            success: true,
        };

        const topBar = <LiveRouteTopBarComponent
            sorttype={sorttype}
            setSorttype={setSorttype}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            allRegions={locationGroups ? locationGroups.data : []}
            amountOfResults={liveRoutesMapped ? liveRoutesMapped.data.length : 0}
            searchEntry={searchEntry}
            setSearchEntry={setSearchEntry}
            handleSearch={handleSearch}
            setDay={setDay}
            day={day}
        />;

        return (
            <>
                <ListViewComponent
                    listData={liveRoutesMapped}
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
                    {current ? liveRouteWidget : <NoneSelected ElementName={'route'}/>}
                </ListViewComponent>
            </>
        );
    } else {
        return (<LoadingElement />);
    }
}
