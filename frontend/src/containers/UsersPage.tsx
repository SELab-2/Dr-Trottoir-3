
import ListViewComponent from '@/components/elements/ListViewElement/ListViewComponent';
import UserElement from '@/components/elements/userElement/UserElement';
import {useSession} from 'next-auth/react';
import {ApiData, getBuildingsList, getLocationGroupsList, getUsersList, useAuthenticatedApi} from '@/api/api';
import {Building, LocationGroup, User} from '@/api/models';
import React, {useEffect, useState} from 'react';
import UserTopBarComponent from '@/components/elements/ListViewElement/TopBarElements/UserTopBarComponent';
import styles from './ContainerStyles.module.css';
import UserListButtonComponent from '@/components/elements/ListViewElement/ListButtonElements/UserListButtonComponent';

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

        getUsersList(session, setUsers, {ordering: sorttype, student__location_group__in: regionsFilter,
            syndicus__id__gt: syndicusFilter, admin__id__gt: adminFilter, student__id__gt: studentFilter,
            student__is_super_student: superStudentFilter});
    }, [session, selectedRegions, sorttype, userType]);


    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if (element != null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [sorttype, selectedRegions]);

    const filterUsers = (data: User[], search: string) => {
        if (!search) {
            return data;
        } else {
            search = search.toLowerCase();
            return data.filter((d) => {
                return (d.first_name.toLowerCase().replace(/ /g, '').includes(search) ||
                    d.last_name.toLowerCase().replace(/ /g, '').includes(search));
            });
        }
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
    />;

    if (users) {
        const filteredUsers: ApiData<User[]> = {
            data: filterUsers(users.data, searchEntry),
            status: users.status,
            success: users.success,
        };

        return (

            <>
                <ListViewComponent
                    listData={filteredUsers}
                    setListData={setUsers}
                    locationGroups={locationGroups}
                    selectedRegions={selectedRegions}
                    setSelectedRegions={setSelectedRegions}
                    current={current}
                    setCurrent={setCurrent}
                    ListItem={UserListButtonComponent}
                    TopBar={topBar}
                    title={'Gebruikers'}
                >
                    {current ? <UserElement id={current}/> : <div>None selected</div>}
                </ListViewComponent>
            </>
        );
    }
}
