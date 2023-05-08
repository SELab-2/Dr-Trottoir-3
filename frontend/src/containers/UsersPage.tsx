import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import UserElement from '@/components/elements/UserElement/UserElement';
import {useSession} from 'next-auth/react';
import {getBuildingsList, getLocationGroupsList, getUsersList, useAuthenticatedApi} from '@/api/api';
import {Building, LocationGroup, User} from '@/api/models';
import React, {useEffect, useState} from 'react';
import UserTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/UserTopBarComponent';
import styles from './containerStyles.module.css';
import UserListButtonComponent from '@/components/elements/ListViewElement/ListButtonElements/UserListButtonComponent';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import Head from 'next/head';
import NoneSelected from '@/components/elements/ListViewElement/NoneSelectedComponent';
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";
import buildingList from "@/components/modules/routeDetail/BuildingList";

export default function UsersPage() {
    const {data: session} = useSession();
    const [users, setUsers] = useAuthenticatedApi<User[]>();
    const [locationGroups, setLocationGroups] = useAuthenticatedApi<LocationGroup[]>();

    const [searchEntry, setSearchEntry] = React.useState('');
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype, setSorttype] = React.useState('last_name');
    const [selectedRegions, setSelectedRegions] = React.useState<LocationGroup[]>([]);
    const [userType, setUserType] = React.useState<string>('');
    const [allBuildings, setAllBuildings] = useAuthenticatedApi<Building[]>();

    useEffect(() => {
        getBuildingsList(session, setAllBuildings);
    }, [session]);

    useEffect(() => {
        getLocationGroupsList(session, setLocationGroups);
    }, [session]);


    useEffect(() => {
        handleSearch(false);
    }, [session, selectedRegions, sorttype, userType]);


    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if (element !== null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [sorttype, selectedRegions]);

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
        let adminFilter = '';
        let syndicusFilter = '';
        let studentFilter = '';
        let superStudentFilter = '';
        if (userType === 'super_student') {
            superStudentFilter = 'true';
        } else if (userType === 'admin') {
            adminFilter='0';
        } else if (userType === 'student') {
            studentFilter = '0';
        } else if (userType === 'syndicus') {
            syndicusFilter = '0';
        }

        getUsersList(session, setUsers, {
            search: searchEntryOverwritten,
            ordering: sorttype, student__location_group__in: regionsFilter,
            syndicus__id__gt: syndicusFilter, admin__id__gt: adminFilter, student__id__gt: studentFilter,
            student__is_super_student: superStudentFilter});
    };


    const topBar = <UserTopBarComponent
        sorttype={sorttype}
        setSorttype={setSorttype}
        selectedRegions={selectedRegions}
        setSelectedRegions={setSelectedRegions}
        allRegions={locationGroups ? locationGroups.data : []}
        amountOfResults={users ? users.data.length : 0}
        searchEntry={searchEntry}
        setSearchEntry={setSearchEntry}
        selectedUserType={userType}
        setSelectedUserType={setUserType}
        allBuildings={allBuildings ? allBuildings.data : []}
        handleSearch={handleSearch}
    />;

    const [userElementWidget, setUserElementWidget] = useState(<LoadingElement />);

    useEffect(() => {
        setUserElementWidget(<LoadingElement />);
        if(current) {
            setUserElementWidget(<UserElement id={current}/>);
        }
    }, [current]);

    if (users && locationGroups && allBuildings) {
        return (

            <>
                <Head>
                    <title>Gebruikers</title>
                </Head>
                <ListViewComponent
                    listData={users}
                    setListData={setUsers}
                    locationGroups={locationGroups}
                    selectedRegions={selectedRegions}
                    setSelectedRegions={setSelectedRegions}
                    current={current}
                    setCurrent={setCurrent}
                    ListItem={UserListButtonComponent}
                    TopBar={topBar}
                    title={'Gebruikers'}
                    Icon={PeopleAltRoundedIcon}
                >
                    {current ? userElementWidget : <NoneSelected ElementName={'gebruiker'}/>}
                </ListViewComponent>
            </>
        );
    } else {
        return (
            <LoadingElement/>
        );
    }
}
