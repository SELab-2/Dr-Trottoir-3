import styles from './buildingDetail.module.css';
import {Box, Link, TextField} from '@mui/material';
import {Building, LocationGroup, User} from '@/api/models';
import {Edit, PictureAsPdf} from '@mui/icons-material';
import {getBuildingDetail, getLocationGroupDetail, getUsersList, useAuthenticatedApi} from '@/api/api';
import {IconButton, Tooltip} from '@mui/material';
import {GarbageCollectionSchedule, GarbageType, Issue} from '@/api/models';
import {
    getBuildingDetailGarbageCollectionSchedules,
    getBuildingDetailIssues,
    getGarbageTypesList,
    postBuildingGenerateLink,
} from '@/api/api';
import {defaultBuildingImage} from '@/constants/images';
import {useSession} from 'next-auth/react';
import React, {useEffect, useState} from 'react';
import ErrorPage from '@/containers/ErrorPage';
import BuildingMap from '@/components/elements/BuildingDetailElement/BuildingMap';
import GarbageCollectionScheduleTemplateList
    from '@/components/elements/BuildingDetailElement/GarbageCollectionScheduleTemplateList';
import EditBuildingPopup from './EditBuildingPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import IssueList from './IssueList';
import GarbageCollectionScheduleList from '@/components/elements/BuildingDetailElement/GarbageCollectionScheduleList';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

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
                <p>Geen handleiding</p>
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

// eslint-disable-next-line require-jsdoc

export default function BuildingDetail(props: { id: number | null, onEdit: () => void }): JSX.Element {
    const id = props.id;

    const [buildingDetail, setBuildingDetail] =
        useState<IBuildingDetail | undefined>(undefined);

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

    const [refreshPrivateLink, setRefreshPrivateLink] = useState(false);

    function buildingGenerateLink() {
        if (id !== null) {
            postBuildingGenerateLink(session, id, () => setRefreshPrivateLink(!refreshPrivateLink));
        }
    }

    useEffect(() => {
        if (id !== null) {
            getBuildingDetail(session, setBuilding, id);
        }
    }, [refreshPrivateLink, id, session, editPopupOpen]);

    // Get location group
    useEffect(() => {
        if (building) {
            getLocationGroupDetail(session, setLocation, building.data.location_group);
        }
    }, [building, session, editPopupOpen]);

    // Get schedules
    useEffect(() => {
        if (id !== null) {
            getBuildingDetailGarbageCollectionSchedules(session, setSchedules, id);
        }
    }, [id, session, editPopupOpen]);

    // Get garbage types
    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
    }, [session, editPopupOpen]);

    // Get issues
    useEffect(() => {
        if (id !== null) {
            getBuildingDetailIssues(session, setIssues, id);
        }
    }, [id, session, editPopupOpen]);

    useEffect(() => {
        getUsersList(session, setSyndici, {'syndicus__buildings': id}, {});
    }, [id, session, editPopupOpen]);

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
                // If all checks have passed, continue with buildings page
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
                            <div style={{margin: 'auto'}}>
                                <IconButton onClick={onOpenEditPopup}>
                                    <Edit fontSize="small"/>
                                </IconButton>
                            </div>
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
                        </div>
                        <div className={styles.building_issues_container}>
                            <div style={{margin: 'auto', display: 'flex', gap: '3px', paddingRight: '5px'}}>
                                <IconButton onClick={buildingGenerateLink}>
                                    <RefreshRoundedIcon/>
                                </IconButton>
                                <IconButton onClick={() => navigator.clipboard.writeText(
                                    window.location.hostname + '/buildings/' + building.data.secret_link)}>
                                    <ContentCopyRoundedIcon/>
                                </IconButton>
                            </div>
                            <TextField
                                fullWidth
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        padding: '2px',
                                    },
                                    '& label.Mui-focused': {
                                        color: 'var(--primary-yellow)',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'var(--primary-yellow)',
                                        borderRadius: '8px',
                                    },
                                }}
                                size="small"
                                InputProps={{
                                    style: {height: '45px'},
                                }}
                                disabled={true}
                                value={building.data.secret_link? window.location.hostname + '/buildings/' +
                                    building.data.secret_link: 'geen actieve link'}
                            />
                        </div>

                        <EditBuildingPopup
                            buildingId={buildingDetail.id}
                            onSubmit={props.onEdit}
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

                {/* Bottom row */}
                <div className={styles.bottom_row_container}>
                    {/* Templates */}
                    <Box flexGrow={2} flexBasis={0}>
                        <GarbageCollectionScheduleTemplateList buildingId={id}/>
                    </Box>
                    {/* Planning */}
                    <Box flexGrow={3} flexBasis={0}>
                        <GarbageCollectionScheduleList buildingId={id}/>
                    </Box>
                    {/* Issues */}
                    <Box flexGrow={2} flexBasis={0}>
                        <IssueList onRead={props.onEdit} buildingId={id}/>
                    </Box>
                </div>
            </div>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}
