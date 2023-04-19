import styles from './buildingDetail.module.css';
import {Box, Link, List, Modal, Typography} from '@mui/material';
import {Building, GarbageCollectionSchedule, GarbageType, Issue, LocationGroup, User} from '@/api/models';
import {PictureAsPdf} from '@mui/icons-material';
import {
    getBuildingDetail, getBuildingDetailGarbageCollectionSchedules, getBuildingDetailIssues,
    getGarbageTypesList, getLocationGroupDetail, getUsersList, useAuthenticatedApi,
} from '@/api/api';
import {defaultBuildingImage} from '@/constants/images';
import {useSession} from 'next-auth/react';
import ScheduleGarbageListItem from './ScheduleGarbageListItem';
import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import BuildingIssueListItem from '@/components/elements/BuildingDetailElement/BuildingIssueListItem';
import ErrorPage from '@/containers/ErrorPage';

interface IBuildingDetail {
  id: number,
  location_group: string,
  name: string,
  address: string,
  pdf_guide: string | null,
  image: string | null,
  syndici: string,
  schedules: GarbageCollectionSchedule[],
  issues: Issue[],
  longitude: number | null,
  latitude: number | null
}

// TODO Add street map using latitude and longitude
// TODO in case there is an error, detail.status is undefined, and not a proper status code. This needs to be fixed.

// eslint-disable-next-line require-jsdoc
function BuildingDetailManualLink(props:{path: string | null }):JSX.Element {
    if (!props.path || props.path.length == 0) {
        return (<></>);
    }
    return (
        <Link href={props.path} className={styles.building_data_manual}>
          Manual
            <PictureAsPdf fontSize="small"/>
        </Link>
    );
}

// eslint-disable-next-line require-jsdoc

export default function BuildingDetail(props: { id: number|null }): JSX.Element {
    const {id} = props;

    const [buildingDetail, setBuildingDetail] =
        useState<IBuildingDetail | undefined>(undefined);
    const [issuesModalOpen, setIssuesModalOpen] = useState(false);
    const handleIssueModalOpen = ()=> setIssuesModalOpen(true);
    const handleIssueModalClose = ()=> setIssuesModalOpen(false);

    const {data: session} = useSession();

    const [building, setBuilding] = useAuthenticatedApi<Building>();
    const [location, setLocation] = useAuthenticatedApi<LocationGroup>();
    const [schedules, setSchedules] = useAuthenticatedApi<GarbageCollectionSchedule[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [issues, setIssues] = useAuthenticatedApi<Issue[]>();
    const [syndici, setSyndici] = useAuthenticatedApi<User[]>();
    const [sessionError, setSessionError] = React.useState(0);

    // Get building data
    useEffect(()=>{
        if (id != null) {
            getBuildingDetail(session, setBuilding, id);
        }
    }, [id, session]);

    // Get location group
    useEffect(()=> {
        if (building) {
            getLocationGroupDetail(session, setLocation, building.data.location_group);
        }
    }, [building, session]);

    // Get schedules
    useEffect(() => {
        if (id != null) {
            getBuildingDetailGarbageCollectionSchedules(session, setSchedules, id);
        }
    }, [id, session]);

    // Get garbage types
    useEffect(()=> {
        getGarbageTypesList(session, setGarbageTypes);
    }, [session]);

    // Get issues
    useEffect(()=> {
        if (id != null) {
            getBuildingDetailIssues(session, setIssues, id);
        }
    }, [id, session]);

    useEffect(()=> {
        getUsersList(session, setSyndici, {'syndicus__buildings': id}, {});
    }, [id, session]);

    useEffect(() => {
        if (session && building && location && schedules && garbageTypes && issues && syndici) {
            // Check if every request managed to go through
            if (!building.success) {
                setSessionError(building.status);
            } else if (!location.success) {
                setSessionError(location.status);
            } else if (!schedules.success) {
                setSessionError(schedules.status);
            } else if (!garbageTypes.success) {
                setSessionError(garbageTypes.status);
            } else if ( !issues.success) {
                setSessionError(issues.status);
            } else if (!syndici.success) {
                setSessionError(syndici.status);
            } else {
                // If all checks have passed, continue with building page
                const garbageNames: {[id: number]: string} = {};
                for (const garbageType of garbageTypes.data) {
                    garbageNames[garbageType.id] = garbageType.name;
                }

                const syndiciNames=syndici.data.map(
                    (syndicus) => `${syndicus.last_name} ${syndicus.first_name}`).
                    sort().join(', ');
                const detail: IBuildingDetail = {
                    id: id ? id : 1,
                    location_group: location.data.name,
                    name: building.data.name ? building.data.name : building.data.address,
                    address: building.data.address,
                    pdf_guide: building.data.pdf_guide,
                    image: building.data.image,
                    syndici: syndiciNames,
                    schedules: schedules.data,
                    issues: issues.data.filter((issue)=> !issue.resolved ),
                    longitude: building.data.longitude,
                    latitude: building.data.latitude,
                };
                setBuildingDetail(detail);
            }
        }
    },
    [id, session, building, location, schedules, garbageTypes, issues, syndici]);

    if (sessionError !== 0) {
        return <ErrorPage status={sessionError}/>;
    }

    if (id == null) {
        return <p>None selected</p>;
    }

    if (!buildingDetail) {
        return <p>Loading...</p>;
    }

    let issuesModalButtonText = `${buildingDetail.issues.length} issues remaining`;
    if (buildingDetail.issues.length === 0) {
        issuesModalButtonText = `No issues`;
    } else if (buildingDetail.issues.length === 1) {
        issuesModalButtonText = `${buildingDetail.issues.length} issue remaining`;
    }


    return (
        <Box className={styles.full}>
            {/* Top row */}
            <Box className={styles.top_row_container}
                sx={{background: 'var(--secondary-light)'}}>
                {/* Building data container */}
                <Box className={styles.building_data_container}>
                    <h1>
                        {buildingDetail.name}
                    </h1>
                    <br/>
                    <Box className={styles.building_data_container_data}>
                        <Typography className={styles.building_data_data}>
                            {buildingDetail.location_group}
                        </Typography>
                        <Typography className={styles.building_data_data}>
                            {buildingDetail.address}
                        </Typography>
                        <Typography className={styles.building_data_data}>
                            {buildingDetail.syndici}
                        </Typography>
                        <br/>
                        <BuildingDetailManualLink path={buildingDetail.pdf_guide}/>
                        {/* Button to open the issue modal*/}
                        <Button onClick={handleIssueModalOpen}>{issuesModalButtonText}</Button>
                    </Box>
                </Box>

                {/* Building description container */}
                <Box className={styles.building_desc_container}>
                    <Typography>
                      TODO add street map longitude {buildingDetail.longitude} and latitude {buildingDetail.latitude}
                    </Typography>
                </Box>

                {/* Building image container */}
                <Box className={styles.building_imag_container}>
                    <img src={
                        buildingDetail.image ?
                            buildingDetail.image :
                            defaultBuildingImage
                    }
                    alt={'Building'}/>
                </Box>
            </Box>

            {/* Middle row for spacing */}
            <Box className={styles.middle_row_divider}></Box>

            {/* Bottom row */}
            <Box className={styles.bottom_row_container}>
                {/* Garbage schedule list */}
                <Box className={styles.garbage_schedule_list}>
                    <Typography
                        variant="h1"
                        className={styles.garbage_schedule_list_header}>
            Planning
                    </Typography>
                    <List>
                        {buildingDetail.schedules.map((schedule) =>
                            <ScheduleGarbageListItem
                                key={schedule.id}
                                id={schedule.id}
                            />
                        )}
                    </List>
                </Box>

                {/* Garbage schedule calendar */}
                <Box className={styles.garbage_calendar}>
          Calendar here
                </Box>
            </Box>

            {/* Modal for the issues */}
            <Modal
                open={issuesModalOpen}
                onClose={handleIssueModalClose}
            >
                <Box className={styles.issue_modal_box}
                    sx={{
                        background: 'var(--primary-light)',
                        maxHeight: '400px',
                        overflow: 'scroll',
                    }}>
                    <List>
                        {
                            buildingDetail.issues.map((issue: Issue) =>
                                <BuildingIssueListItem issue={issue.id} key={issue.id}/>
                            )
                        }
                    </List>
                </Box>
            </Modal>
        </Box>
    );
}
