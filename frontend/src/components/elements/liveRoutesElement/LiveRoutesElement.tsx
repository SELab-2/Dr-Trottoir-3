import {Avatar} from '@mui/material';
import styles from './LiveRoutesElement.module.css';
import {
    ApiData,
    getBuildingsList,
    getLocationGroupDetail, getScheduleAssignmentsList,
    getScheduleDefinitionDetail, getScheduleWorkEntriesList,
    getUserDetail,
    useAuthenticatedApi
} from '@/api/api';
import {useSession} from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import React, {useEffect} from 'react';
import {Building, LocationGroup, ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry, User} from '@/api/models';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import {styled} from "@mui/system";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 30,
    width: '100%',
    borderRadius: 15,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'var(--secondary-dark)',
    },
    [`& .${linearProgressClasses.bar}`]: {
        backgroundColor: 'var(--primary-yellow)',
    },
}));

export default function LiveRoutesElement() {
    const {data: session} = useSession();

    const scheduleDefinitionId = 5;

    const [scheduleDefinitionData, setScheduleDefinitionData] = useAuthenticatedApi<ScheduleDefinition>();
    const [locationGroupData, setLocationGroupData] = useAuthenticatedApi<LocationGroup>();
    const [buildingsData, setBuildingsData] = useAuthenticatedApi<Array<Building>>();
    const [scheduleAssignmentData, setScheduleAssignmentData] = useAuthenticatedApi<ScheduleAssignment>();
    const [workEntriesData, setWorkEntriesData] = useAuthenticatedApi<Array<ScheduleWorkEntry>>();

    useEffect(() => {
        getScheduleDefinitionDetail(session, setScheduleDefinitionData, scheduleDefinitionId);
    }, [session]);

    useEffect(() => {
        if(scheduleDefinitionData) {
            getLocationGroupDetail(session, setLocationGroupData, scheduleDefinitionData.data.location_group);
        }
    }, [session, scheduleDefinitionData]);

    useEffect(() => {
        if(scheduleDefinitionData) {
            getBuildingsList(
                session,
                (response: ApiData<Array<Building>>) =>
                    setBuildingsData(
                        {
                            status: response.status,
                            success: response.success,
                            data: response.data.filter(item => scheduleDefinitionData.data.buildings.includes(item.id))
                        }
                    ));
        }
    }, [session, scheduleDefinitionData]);

    useEffect(() => {
        if(scheduleDefinitionData) {
            getScheduleAssignmentsList(
                session,
                (response: ApiData<Array<ScheduleAssignment>>) =>
                    setScheduleAssignmentData(
                        {
                            status: response.status,
                            success: response.success,
                            data: response.data.filter(item => item.schedule_definition == scheduleDefinitionId)[0] // TODO assuming present, might not be
                        }));
        }
    }, [session, scheduleDefinitionData]);


    useEffect(() => {
        if(scheduleAssignmentData) {
            getScheduleWorkEntriesList(
                session,
                (response: ApiData<Array<ScheduleWorkEntry>>) =>
                    setWorkEntriesData(
                        {
                            status: response.status,
                            success: response.success,
                            data: response.data.filter(item => item.schedule_assignment == scheduleAssignmentData.data.id)
                        }));
        }
    }, [session, scheduleAssignmentData]);

    if (!scheduleDefinitionData || !locationGroupData || !buildingsData) {
        return (<div>Loading...</div>);
    } else {
        if (scheduleDefinitionData.success && locationGroupData.success && buildingsData.success) {
            return (
                <div className={styles.userElement}>
                    <div className={styles.userHeader}>
                        <div className={styles.firstColumn}>
                            <h1>{scheduleDefinitionData.data.name}</h1>
                            <p>{locationGroupData.data.name}</p>
                        </div>
                        <div className={styles.stats}>
                            <p>2/5 voltooid</p>
                        </div>
                        <div className={styles.loadingBar}>
                            <BorderLinearProgress variant="determinate" value={50} />
                        </div>
                    </div>
                    <div className={styles.userContent}>
                        <div className={styles.userRoutes + ' ' + styles.userRoutesPadding}>
                            <h2 className={styles.routesTitle + ' ' + styles.extraTitlePadding}>Gebouwen</h2>
                            <div className={styles.scrollList}>
                                <div className={styles.routesItems}>
                                    {
                                        buildingsData.data.map(building => {
                                            return (
                                                <div className={styles.routesItem}>
                                                    <h4>{building.address}</h4>
                                                    <CloseIcon/>
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
                    {scheduleDefinitionData.status}
                </div>
            );
        }
    }
}
