import styles from './buildingDetail.module.css';
import {Box, IconButton, Link, List, Modal, Tooltip, Typography} from '@mui/material';
import {Building, GarbageCollectionSchedule, GarbageType, Issue, LocationGroup, User} from '@/api/models';
import {PictureAsPdf, Edit} from '@mui/icons-material';
import {
    getBuildingDetail,
    getBuildingDetailGarbageCollectionSchedules,
    getBuildingDetailIssues,
    getGarbageTypesList,
    getLocationGroupDetail,
    getUsersList,
    useAuthenticatedApi,
} from '@/api/api';
import {defaultBuildingImage} from '@/constants/images';
import {useSession} from 'next-auth/react';
import ScheduleGarbageListItem from './ScheduleGarbageListItem';
import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import BuildingIssueListItem from '@/components/elements/BuildingDetailElement/BuildingIssueListItem';
import ErrorPage from '@/containers/ErrorPage';
import BuildingMap from '@/components/elements/BuildingDetailElement/BuildingMap';
import GarbageCollectionScheduleTemplateList
    from '@/components/elements/BuildingDetailElement/GarbageCollectionScheduleTemplateList';
import EditBuildingPopup from '@/components/elements/BuildingDetailElement/EditBuildingPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';

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
    latitude: number | null,
    description: string
}

// TODO in case there is an error, detail.status is undefined, and not a proper status code. This needs to be fixed.


function BuildingDetailManualLink(props: { path: string | null }): JSX.Element {
    if (!props.path || props.path.length === 0) {
        return (
            <div className={styles.pdf_container}>
                <PictureAsPdf fontSize='small'/>
                <p>geen handleiding</p>
            </div>
        );
    }
    return (
        <Link href={props.path} className={styles.pdf_container}>
            Manual
            <PictureAsPdf fontSize='small'/>
        </Link>
    );
}


export default function BuildingDetail(props: { id: number | null }): JSX.Element {
    const id = props.id;

    const [buildingDetail, setBuildingDetail] =
        useState<IBuildingDetail | undefined>(undefined);
    const [issuesModalOpen, setIssuesModalOpen] = useState(false);
    const handleIssueModalOpen = () => setIssuesModalOpen(true);
    const handleIssueModalClose = () => setIssuesModalOpen(false);

    const {data: session} = useSession();

    const [building, setBuilding] = useAuthenticatedApi<Building>();
    const [location, setLocation] = useAuthenticatedApi<LocationGroup>();
    const [schedules, setSchedules] = useAuthenticatedApi<GarbageCollectionSchedule[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [issues, setIssues] = useAuthenticatedApi<Issue[]>();
    const [syndici, setSyndici] = useAuthenticatedApi<User[]>();
    const [sessionError, setSessionError] = React.useState(0);

    const [editPopupOpen, setEditPopupOpen] = useState(false);

    function onOpenEditPopup() {
        setEditPopupOpen(true);
    }

    // Get building data
    useEffect(() => {
        if (id !== null) {
            getBuildingDetail(session, setBuilding, id);
        }
    }, [id, session]);

    // Get location group
    useEffect(() => {
        if (building) {
            getLocationGroupDetail(session, setLocation, building.data.location_group);
        }
    }, [building, session]);

    // Get schedules
    useEffect(() => {
        if (id !== null) {
            getBuildingDetailGarbageCollectionSchedules(session, setSchedules, id);
        }
    }, [id, session]);

    // Get garbage types
    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
    }, [session]);

    // Get issues
    useEffect(() => {
        if (id !== null) {
            getBuildingDetailIssues(session, setIssues, id);
        }
    }, [id, session]);

    useEffect(() => {
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
            } else if (!issues.success) {
                setSessionError(issues.status);
            } else if (!syndici.success) {
                setSessionError(syndici.status);
            } else {
                // If all checks have passed, continue with building page
                const garbageNames: { [id: number]: string } = {};
                for (const garbageType of garbageTypes.data) {
                    garbageNames[garbageType.id] = garbageType.name;
                }

                const syndiciNames = syndici.data.map(
                    (syndicus) => `${syndicus.last_name} ${syndicus.first_name}`).sort().join(', ');
                const detail: IBuildingDetail = {
                    id: id ? id : 1,
                    location_group: location.data.name,
                    name: building.data.name ? building.data.name : building.data.address,
                    address: building.data.address,
                    pdf_guide: building.data.pdf_guide,
                    image: building.data.image,
                    syndici: syndiciNames,
                    schedules: schedules.data,
                    issues: issues.data.filter((issue) => !issue.resolved),
                    longitude: building.data.longitude,
                    latitude: building.data.latitude,
                    description: building.data.description,
                };
                setBuildingDetail(detail);
            }
        }
    },
    [id, session, building, location, schedules, garbageTypes, issues, syndici]);

    if (sessionError !== 0) {
        return <ErrorPage status={sessionError}/>;
    }

    if (id === null) {
        return <p>None selected</p>;
    }

    if (building && location && schedules && garbageTypes && issues && syndici && buildingDetail) {
        let issuesModalButtonText = `${buildingDetail.issues.length} issues remaining`;
        if (buildingDetail.issues.length === 0) {
            issuesModalButtonText = `No issues`;
        } else if (buildingDetail.issues.length === 1) {
            issuesModalButtonText = `${buildingDetail.issues.length} issue remaining`;
        }

        return (
            <div className={styles.full}>
                {/* Top row */}
                <div className={styles.top_row_container}>
                    {/* Building data container */}
                    <div className={styles.building_general_container}>
                        <div className={styles.building_title_container}>
                            <Tooltip title={buildingDetail.name} placement="top">
                                <h1 className={styles.building_data_title}>
                                    {buildingDetail.name}
                                </h1>
                            </Tooltip>
                            <IconButton onClick={onOpenEditPopup}>
                                <Edit fontSize="small"/>
                            </IconButton>
                        </div>
                        <div className={styles.building_data_container}>
                            <Tooltip title={buildingDetail.location_group} placement="right">
                                <p>{buildingDetail.location_group}</p>
                            </Tooltip>
                            <Tooltip title={buildingDetail.address} placement="right">
                                <p>{buildingDetail.address}</p>
                            </Tooltip>
                            <Tooltip title={buildingDetail.syndici} placement="right">
                                <p>{buildingDetail.syndici}</p>
                            </Tooltip>
                            {/* Button to open the issue modal*/}
                        </div>
                        <div className={styles.building_issues_container}>
                            <BuildingDetailManualLink path={buildingDetail.pdf_guide}/>
                            <div style={{flex: '1'}}></div>
                            <Button onClick={handleIssueModalOpen} className={styles.issue_button}>{issuesModalButtonText}</Button>
                        </div>

                        <EditBuildingPopup
                            buildingId={buildingDetail.id}
                            open={editPopupOpen}
                            setOpen={setEditPopupOpen}
                            prevName={buildingDetail.name}
                            prevAddress={buildingDetail.address}
                            prevLongitude={buildingDetail.longitude}
                            prevLatitude={buildingDetail.latitude}
                            prevSyndici={syndici.data}
                            prevDescription={buildingDetail.description}
                        />
                    </div>

                    {/* Building description container */}
                    <div className={styles.building_desc_container}>
                        <BuildingMap longitude={buildingDetail.longitude} latitude={buildingDetail.latitude}/>
                    </div>

                    {/* Building image container */}
                    <div className={styles.building_imag_container}>
                        <img src={
                            buildingDetail.image ?
                                buildingDetail.image :
                                defaultBuildingImage
                        }
                        alt={'Building'}/>
                    </div>
                </div>

                {/* Middle row for spacing */}
                <div className={styles.middle_row_divider}></div>

                {/* Bottom row */}
                <div className={styles.bottom_row_container}>
                    {/* Garbage schedule list */}
                    <div className={styles.garbage_schedule_list}>
                        <Typography variant='h5'>
                            Templates
                        </Typography>
                        {id ? <GarbageCollectionScheduleTemplateList id={id}/> : undefined}
                        <Typography variant='h5'>
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
                    </div>

                    {/* Garbage schedule calendar */}
                    <div className={styles.garbage_calendar}>
                        Calendar here
                    </div>
                </div>

                {/* Modal for the issues */}
                <Modal
                    open={issuesModalOpen}
                    onClose={handleIssueModalClose}
                >
                    <div className={styles.issue_modal_box}
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
                    </div>
                </Modal>
            </div>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}
