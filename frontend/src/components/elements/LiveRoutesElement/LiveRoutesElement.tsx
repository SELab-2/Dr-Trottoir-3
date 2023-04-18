import styles from './liveRoutesElement.module.css';
import {
    ApiData,
    getBuildingsList,
    getLocationGroupDetail, getScheduleAssignmentDetail,
    getScheduleDefinitionDetail, getScheduleWorkEntriesList,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import React, {useEffect} from 'react';
import {Building, LocationGroup, ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry} from '@/api/models';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';
import {styled} from '@mui/system';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import DoneIcon from '@mui/icons-material/Done';

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
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

type liveRoutesElementProps = {
    id: number
}

export default function LiveRoutesElement(props: liveRoutesElementProps) {
    const {data: session} = useSession();

    // TODO - all frontend filtering should be replaced with filter queries
    const [scheduleDefinitionData, setScheduleDefinitionData] = useAuthenticatedApi<ScheduleDefinition>();
    const [locationGroupData, setLocationGroupData] = useAuthenticatedApi<LocationGroup>();
    const [buildingsData, setBuildingsData] = useAuthenticatedApi<Array<Building>>();
    const [scheduleAssignmentData, setScheduleAssignmentData] = useAuthenticatedApi<ScheduleAssignment>();
    const [workEntriesData, setWorkEntriesData] = useAuthenticatedApi<Array<ScheduleWorkEntry>>();

    useEffect(() => {
        getScheduleAssignmentDetail(session, setScheduleAssignmentData, props.id);
    }, [props.id]);

    useEffect(() => {
        if (scheduleAssignmentData) {
            getScheduleDefinitionDetail(
                session,
                setScheduleDefinitionData,
                scheduleAssignmentData.data.schedule_definition
            );
        }
    }, [scheduleAssignmentData]);

    useEffect(() => {
        if (scheduleDefinitionData) {
            getLocationGroupDetail(session, setLocationGroupData, scheduleDefinitionData.data.location_group);
        }
    }, [session, scheduleDefinitionData]);

    useEffect(() => {
        if (scheduleDefinitionData) {
            getBuildingsList(
                session,
                (response: ApiData<Array<Building>>) =>
                    setBuildingsData(
                        {
                            status: response.status,
                            success: response.success,
                            data: response.data.filter(
                                (item) => scheduleDefinitionData.data.buildings.includes(item.id)
                            ),
                        }
                    )
            );
        }
    }, [session, scheduleDefinitionData]);

    useEffect(() => {
        if (scheduleAssignmentData) {
            getScheduleWorkEntriesList(
                session,
                (response: ApiData<Array<ScheduleWorkEntry>>) =>
                    setWorkEntriesData(
                        {
                            status: response.status,
                            success: response.success,
                            data: response.data.filter(
                                (item) => item.schedule_assignment == props.id
                            ),
                        }));
        }
    }, [session, scheduleAssignmentData]);

    if (
        !scheduleDefinitionData ||
        !locationGroupData ||
        !buildingsData ||
        !workEntriesData ||
        !scheduleAssignmentData ||
        !session
    ) {
        return (<div>Loading...</div>);
    } else {
        if (
            scheduleDefinitionData.success &&
            locationGroupData.success &&
            buildingsData.success &&
            workEntriesData.success &&
            scheduleAssignmentData.success
        ) {
            return (
                <div className={styles.userElement}>
                    <div className={styles.userHeader}>
                        <div className={styles.firstColumn}>
                            <h1>{scheduleDefinitionData.data.name}</h1>
                            <p>{locationGroupData.data.name} {scheduleAssignmentData.data.assigned_date}</p>
                        </div>
                        <div className={styles.stats}>
                            <p>{buildingsData.data.map((building) => {
                                return workEntriesData?.data.filter(
                                    (workEntry) => workEntry.building === building.id &&
                                            workEntry.schedule_assignment === scheduleAssignmentData?.data.id
                                ).map((workEntry) => workEntry.entry_type).includes('DE') ? 1 : 0;
                                // @ts-ignore
                            }).reduce((a, b) => (a + b))}
                                /
                            {buildingsData.data.length} voltooid</p>
                        </div>
                        <div className={styles.loadingBar}>
                            <BorderLinearProgress variant="determinate" value={
                                buildingsData.data.map((building) => {
                                    return workEntriesData?.data.filter(
                                        (workEntry) => workEntry.building === building.id &&
                                            workEntry.schedule_assignment === scheduleAssignmentData?.data.id
                                    ).map((workEntry) => workEntry.entry_type).includes('DE') ? 1 : 0;
                                    // @ts-ignore
                                }).reduce((a, b) => (a+b)) / buildingsData.data.length * 100
                            } />
                        </div>
                    </div>
                    <div className={styles.userContent}>
                        <div className={styles.userRoutes + ' ' + styles.userRoutesPadding}>
                            <h2 className={styles.routesTitle + ' ' + styles.extraTitlePadding}>Gebouwen</h2>
                            <div className={styles.scrollList}>
                                <div className={styles.routesItems}>
                                    {buildingsData.data.map((building) =>
                                        <div className={styles.routesItem}>
                                            <h4>{building.address}</h4>

                                            {workEntriesData?.data.filter(
                                                (workEntry) => workEntry.building === building.id &&
                                                    workEntry.schedule_assignment === scheduleAssignmentData?.data.id
                                            ).map(
                                                (workEntry) => workEntry.entry_type).includes('DE') ? <DoneIcon /> :
                                                workEntriesData?.data.filter(
                                                    (workEntry) => workEntry.building === building.id &&
                                                    workEntry.schedule_assignment === scheduleAssignmentData?.data.id
                                                ).map(
                                                    (workEntry) => workEntry.entry_type).includes('WO') ?
                                                    <PersonPinCircleIcon /> :
                                                    workEntriesData?.data.filter(
                                                        (workEntry) => workEntry.building === building.id &&
                                                    workEntry.schedule_assignment === scheduleAssignmentData?.data.id
                                                    ).map((workEntry) => workEntry.entry_type).includes('AR') ?
                                                        <PersonPinCircleIcon /> : <CloseIcon />
                                            }
                                        </div>
                                    )}
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
                    <br/>
                    {locationGroupData.status}
                    <br/>
                    {buildingsData.status}
                    <br/>
                    {workEntriesData.status}
                    <br/>
                    {scheduleAssignmentData.status}
                </div>
            );
        }
    }
}
