import {Avatar} from '@mui/material';
import styles from './userElement.module.css';
import {
    getLocationGroupDetail, getScheduleAssignmentsList,
    getScheduleDefinitionsList,
    getUserDetail,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import React, {useEffect, useState} from 'react';
import {LocationGroup, ScheduleAssignment, ScheduleDefinition, User} from '@/api/models';
import {Edit} from '@mui/icons-material';
import Button from '@mui/material/Button';
import EditUserPopup from '@/components/elements/UserElement/EditUserPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';


type userElementProps = {
    id: number,
}

export default function UserElement(props: userElementProps) {
    const {data: session} = useSession();

    const [userData, setUserData] = useAuthenticatedApi<User>();
    const [scheduleDefinitions, setScheduleDefinitions] = useAuthenticatedApi<Array<ScheduleDefinition>>();
    const [scheduleAssignmentsData, setScheduleAssignmentsData] = useAuthenticatedApi<Array<ScheduleAssignment>>();
    const [locationGroupData, setLocationGroupData] = useAuthenticatedApi<LocationGroup>();

    const [editPopupOpen, setEditPopupOpen] = useState<boolean>(false);
    function onOpenEditPopup() {
        setEditPopupOpen(true);
    }

    useEffect(() => {
        getUserDetail(session, setUserData, props.id);
    }, [session, props.id, editPopupOpen]);


    useEffect(() => {
        getScheduleDefinitionsList(session, setScheduleDefinitions);
    }, [session]);

    useEffect(() => {
        getScheduleAssignmentsList(session, setScheduleAssignmentsData, {user: props.id});
    }, [session, props.id]);

    useEffect(() => {
        if (userData && userData.data.student?.location_group) {
            getLocationGroupDetail(session, setLocationGroupData, userData.data.student.location_group);
        }
    }, [session, userData]);

    if (!userData || !scheduleDefinitions || !scheduleAssignmentsData || !locationGroupData) {
        return (
            <LoadingElement/>
        );
    } else {
        if (userData.success && scheduleDefinitions.success && scheduleAssignmentsData.success && locationGroupData.success) {
            return (
                <div className={styles.userElement}>
                    <div className={styles.userHeader}>
                        <div className={styles.firstColumn}>
                            <div className={styles.firstColumnRow}>
                                <h1>{userData.data.first_name}</h1>
                                <h1>{userData.data.last_name}</h1>
                                <p>
                                    {
                                        userData.data.admin ? 'Admin' :
                                            userData.data.syndicus ? 'Syndicus' :
                                                userData.data.student && userData.data.student.is_super_student ?
                                                    'SuperStudent' : 'Student'
                                    }
                                </p>
                            </div>
                            <div className={styles.firstColumnRow}>
                                <p>{userData.data.student ? locationGroupData?.data.name : ''}</p>
                            </div>
                            <Button startIcon={<Edit/>} onClick={onOpenEditPopup}>
                                Gebruiker aanpassen
                            </Button>
                            <EditUserPopup
                                userId={userData.data.id}
                                open={editPopupOpen}
                                setOpen={setEditPopupOpen}
                                prevFirstName={userData.data.first_name}
                                prevLastName={userData.data.last_name}
                                prevStudent={userData.data.student}
                                prevSyndic={userData.data.syndicus}
                            />
                        </div>
                        <div className={styles.picture}>
                            <Avatar
                                alt="Avatar"
                                src="/static/images/avatar/1.jpg"
                                sx={{height: 128, width: 128}}
                            />
                        </div>
                    </div>
                    <div className={styles.userContent}>
                        <div className={styles.userRoutes + ' ' + styles.userRoutesPadding}>
                            <h2 className={styles.routesTitle + ' ' + styles.extraTitlePadding}>Routes</h2>
                            <div className={styles.scrollList}>
                                <div className={styles.routesItems}>
                                    <h3 className={styles.routesSubtitle + ' ' + styles.extraTitlePadding}>Gepland</h3>
                                    {
                                        scheduleAssignmentsData?.data
                                            .filter((e) => {
                                                const dateParts = e.assigned_date.split('-');
                                                const dateObject = new Date(
                                                    +dateParts[2],
                                                    // @ts-ignore
                                                    dateParts[1] - 1,
                                                    +dateParts[0]
                                                );
                                                return dateObject <= new Date(Date.now());
                                            })
                                            .map((e) => {
                                                return (
                                                    <div className={styles.routesItem}>
                                                        <h4>
                                                            {
                                                                // @ts-ignore
                                                                scheduleDefinitions?.data.filter(
                                                                    // eslint-disable-next-line max-len
                                                                    (scheduleDefinition) => scheduleDefinition.id === e.schedule_definition
                                                                ).at(0).name
                                                            }
                                                        </h4>
                                                        <p>{e.assigned_date}</p>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>

                                <div className={styles.routesItems}>
                                    <h3 className={styles.routesSubtitle + ' ' + styles.extraTitlePadding}>
                                        Geschiedenis
                                    </h3>
                                    {
                                        scheduleAssignmentsData?.data
                                            .filter((e) => {
                                                const dateParts = e.assigned_date.split('-');
                                                // @ts-ignore
                                                const dateObject = new Date(
                                                    +dateParts[2],
                                                    // @ts-ignore
                                                    dateParts[1] - 1,
                                                    +dateParts[0]
                                                );
                                                return dateObject > new Date(Date.now());
                                            })
                                            .map((e) => {
                                                return (
                                                    <div className={styles.routesItem}>
                                                        <h4>
                                                            {
                                                                // @ts-ignore
                                                                // eslint-disable-next-line max-len
                                                                scheduleDefinitions?.data.filter((scheduleDefinition) => scheduleDefinition.id === e.schedule_definition).at(0).name
                                                            }
                                                        </h4>
                                                        <p>{e.assigned_date}</p>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.userAnalytics}>
                            <div className={styles.graph}></div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {userData.status}
                </div>
            );
        }
    }
}
