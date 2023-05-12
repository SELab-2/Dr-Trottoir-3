import styles from './buildingDetail.module.css';
import {Box, Link, List, Typography} from '@mui/material';
import {Building, GarbageCollectionSchedule, GarbageType, Issue, LocationGroup, User} from '@/api/models';
import {Edit, PictureAsPdf} from '@mui/icons-material';
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
import ErrorPage from '@/containers/ErrorPage';
import BuildingMap from '@/components/elements/BuildingDetailElement/BuildingMap';
import GarbageCollectionScheduleTemplateList
    from '@/components/elements/BuildingDetailElement/GarbageCollectionScheduleTemplateList';
import EditBuildingPopup from '@/components/elements/BuildingDetailElement/EditBuildingPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import useMediaQuery from "@mui/material/useMediaQuery";
import IssueList from "@/components/elements/BuildingDetailElement/IssueList";
import GarbageCollectionScheduleList from "@/components/elements/BuildingDetailElement/GarbageCollectionScheduleList";

interface IBuildingDetail {
    id: number,
    location_group: string,
    name: string,
    address: string,
    pdf_guide: string | null,
    image: string | null,
    syndici: string,
    longitude: number | null,
    latitude: number | null,
    description: string
}

// TODO in case there is an error, detail.status is undefined, and not a proper status code. This needs to be fixed.

// eslint-disable-next-line require-jsdoc
function BuildingDetailManualLink(props: { path: string | null }): JSX.Element {
    if (!props.path || props.path.length === 0) {
        return (<></>);
    }
    return (
        <Link href={props.path} className={styles.building_data_manual}>
            Manual
            <PictureAsPdf fontSize='small'/>
        </Link>
    );
}

// eslint-disable-next-line require-jsdoc

export default function BuildingDetail(props: { id: number | null }): JSX.Element {
    const mobileView = useMediaQuery('(max-width:1000px)');
    const id = props.id;

    const [buildingDetail, setBuildingDetail] =
        useState<IBuildingDetail | undefined>(undefined);

    const {data: session} = useSession();

    const [building, setBuilding] = useAuthenticatedApi<Building>();
    const [location, setLocation] = useAuthenticatedApi<LocationGroup>();
    const [syndici, setSyndici] = useAuthenticatedApi<User[]>();
    const [sessionError, setSessionError] = React.useState(0);

    const [editPopupOpen, setEditPopupOpen] = useState(false);

    function onOpenEditPopup() {
        setEditPopupOpen(true);
    }

    // Get building data and issues and schedules
    useEffect(() => {
        if (id !== null) {
            getBuildingDetail(session, setBuilding, id);
            getUsersList(session, setSyndici, {'syndicus__buildings': id}, {});
        }
    }, [id, session]);

    // Get location group
    useEffect(() => {
        if (building) {
            getLocationGroupDetail(session, setLocation, building.data.location_group);
        }
    }, [building, session]);

    useEffect(() => {
            if (session && building && location && syndici) {
                // Check if every request managed to go through
                if (!building.success) {
                    setSessionError(building.status);
                } else if (!location.success) {
                    setSessionError(location.status);
                } else if (!syndici.success) {
                    setSessionError(syndici.status);
                } else {
                    // If all checks have passed, continue with building page

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
                        longitude: building.data.longitude,
                        latitude: building.data.latitude,
                        description: building.data.description,
                    };
                    setBuildingDetail(detail);
                }
            }
        },
        [id, session, building, location, syndici]);

    if (sessionError !== 0) {
        return <ErrorPage status={sessionError}/>;
    }

    if (id === null) {
        return <p>None selected</p>;
    }

    if (building && location && syndici && buildingDetail) {
        return (
            <Box padding={1} display={'flex'} flexDirection={'column'} width={'min-content'} flexGrow={1}>
                {/* Top row */}
                <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'}
                     borderRadius={'var(--small_corner)'}
                     display={'flex'} gap={1}>
                    {/* Building data container */}
                    <Box flexGrow={1} flexBasis={0}>
                        <Typography variant={mobileView ? 'h5' : 'h4'}
                                    noWrap>{buildingDetail.name}</Typography>
                        <Typography variant={'subtitle1'} noWrap>{buildingDetail.location_group}</Typography>
                        <Typography>{buildingDetail.address}</Typography>
                        <Typography>{buildingDetail.syndici}</Typography>
                        <BuildingDetailManualLink path={buildingDetail.pdf_guide}/>
                        <Button startIcon={<Edit/>} onClick={onOpenEditPopup}>
                            Gebouw aanpassen
                        </Button>
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
                    </Box>

                    {/* Building description container */}
                    { mobileView ? <></> : <Box flexGrow={1} flexBasis={0}>
                        <BuildingMap longitude={buildingDetail.longitude} latitude={buildingDetail.latitude}/>
                    </Box>}

                    {/* Building image container */}
                    <Box flexGrow={1} flexBasis={0}>
                        <img width={'100%'} src={
                            buildingDetail.image ?
                                buildingDetail.image :
                                defaultBuildingImage
                        }
                             alt={'Building'}/>
                    </Box>
                </Box>

                {/* Bottom row */}
                <Box display={'flex'} gap={1}>
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
                        <IssueList buildingId={id}/>
                    </Box>
                </Box>
            </Box>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}
