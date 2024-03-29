import {Avatar} from '@mui/material';
import styles from './meElement.module.css';
import {
    getLocationGroupDetail, getMe, getScheduleAssignmentsList, getScheduleDefinitionsAssignedToMeList,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import React, {useEffect} from 'react';
import {LocationGroup, ScheduleAssignment, ScheduleDefinition, User} from '@/api/models';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';


export default function MeElement() {
    const {data: session} = useSession();

    const [userData, setUserData] = useAuthenticatedApi<User>();
    const [scheduleDefinitions, setScheduleDefinitions] = useAuthenticatedApi<Array<ScheduleDefinition>>();
    const [scheduleAssignmentsData, setScheduleAssignmentsData] = useAuthenticatedApi<Array<ScheduleAssignment>>();
    const [locationGroupData, setLocationGroupData] = useAuthenticatedApi<LocationGroup>();

    useEffect(() => {
        getMe(session, setUserData);
    }, [session]);

    useEffect(() => {
        getScheduleDefinitionsAssignedToMeList(session, setScheduleDefinitions);
    }, [session]);

    useEffect(() => {
        // @ts-ignore
        getScheduleAssignmentsList(session, setScheduleAssignmentsData, {user: session.userid});
    }, [session]);

    useEffect(() => {
        if (userData && userData.data.student?.location_group) {
            getLocationGroupDetail(session, setLocationGroupData, userData.data.student.location_group);
        }
    }, [session, userData]);

    if (userData && scheduleDefinitions && scheduleAssignmentsData && (!userData.data.student || locationGroupData)) {
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
                    </div>
                    <div className={styles.picture}>
                        <Avatar
                            alt="Avatar"
                            src="/static/images/avatar/1.jpg"
                            sx={{height: 128, width: 128}}
                        >{userData.data.first_name.at(0)}</Avatar>
                    </div>
                </div>
                <div className={styles.userContent}>
                    <div className={styles.userRoutes + ' ' + styles.userRoutesPadding}>
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
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <LoadingElement/>
        );
    }
}
