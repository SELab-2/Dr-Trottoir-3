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
import React, {useEffect, useState} from 'react';
import {Building, LocationGroup, ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry} from '@/api/models';
import LinearProgress, {linearProgressClasses} from '@mui/material/LinearProgress';
import {styled} from '@mui/system';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import DoneIcon from '@mui/icons-material/Done';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {Fade, Modal, Tooltip, Typography} from '@mui/material';
import RouteMap from '@/components/modules/routeDetail/RouteMap';

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
    id: number,
}

export default function LiveRoutesElement(props: liveRoutesElementProps) {
    const {data: session} = useSession();

    // TODO - all frontend filtering should be replaced with filter queries
    const [scheduleDefinitionData, setScheduleDefinitionData] = useAuthenticatedApi<ScheduleDefinition>();
    const [locationGroupData, setLocationGroupData] = useAuthenticatedApi<LocationGroup>();
    const [buildingsData, setBuildingsData] = useAuthenticatedApi<Array<Building>>();
    const [scheduleAssignmentData, setScheduleAssignmentData] = useAuthenticatedApi<ScheduleAssignment>();
    const [workEntriesData, setWorkEntriesData] = useAuthenticatedApi<Array<ScheduleWorkEntry>>();
    const [open, setOpen] = useState(false);
    const [image, setImage] = useState('false');
    const [hovering, setHovering] = useState<Building['id'] | null>(null);

    const handleClose = () => {
        setOpen(false);
    };

    const handleImage = (value: string) => {
        setImage(value);
        setOpen(true);
        console.log(image);
    };

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
                                (item) => item.schedule_assignment === props.id
                            ),
                        }));
        }
    }, [session, scheduleAssignmentData]);

    const orderedBuildings: () => Building[] = () => buildingsData?.data
        .map((e) => (e || []))
        .flat() || [];

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
                            <Tooltip title={scheduleDefinitionData.data.name} placement="top">
                                <h1 className={styles.building_data_title}>
                                    {scheduleDefinitionData.data.name}
                                </h1>
                            </Tooltip>
                            <Tooltip title={locationGroupData.data.name} placement="right">
                                <p>{locationGroupData.data.name}</p>
                            </Tooltip>
                            <Tooltip title={scheduleAssignmentData.data.assigned_date} placement="right">
                                <p>{scheduleAssignmentData.data.assigned_date}</p>
                            </Tooltip>
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
                            <Typography variant='h5'>Planning</Typography>
                            <div className={styles.scrollList}>
                                <div className={styles.routesItems}>
                                    {buildingsData.data.map((building) =>
                                        <div className={styles.route_container}>
                                            <div className={styles.route_title}>
                                                <Tooltip title={building.address} placement="top">
                                                    <h1 className={styles.building_item_title}>
                                                        {building.address}
                                                    </h1>
                                                </Tooltip>

                                                {workEntriesData?.data
                                                    .filter((workEntry) => workEntry.building === building.id &&
                                                                    workEntry.schedule_assignment ===
                                                        scheduleAssignmentData?.data.id)
                                                    .map((workEntry) => workEntry.entry_type).includes('DE') ?
                                                    <div style={{display: 'flex', gap: '20px'}}>
                                                        <DoneIcon/>
                                                        <div style={{margin: 'auto', paddingRight: '50px'}}>
                                                            {
                                                                // @ts-ignore
                                                                workEntriesData.data.filter((e) =>
                                                                    e.building === building.id && e.entry_type === 'WO')
                                                                    .at(0).creation_timestamp.split('T')[1]
                                                            }
                                                        </div>
                                                    </div> :
                                                    workEntriesData?.data.filter(
                                                        (workEntry) =>
                                                            workEntry.building === building.id &&
                                                                    workEntry.schedule_assignment ===
                                                            scheduleAssignmentData?.data.id
                                                    ).map(
                                                        (workEntry) => workEntry.entry_type).includes('WO') ?
                                                        <div style={{display: 'flex', gap: '20px'}}>
                                                            <PersonPinCircleIcon/>
                                                            <div style={{margin: 'auto', paddingRight: '50px'}}>
                                                                {
                                                                    '--:--:--'
                                                                }
                                                            </div>
                                                        </div> :
                                                        workEntriesData?.data.filter(
                                                            (workEntry) => workEntry.building === building.id &&
                                                                    workEntry.schedule_assignment ===
                                                                scheduleAssignmentData?.data.id
                                                        ).map((workEntry) => workEntry.entry_type).includes('AR') ?
                                                            <div style={{display: 'flex', gap: '20px'}}>
                                                                <PersonPinCircleIcon/>
                                                                <div style={{margin: 'auto', paddingRight: '50px'}}>
                                                                    {
                                                                        '--:--:--'
                                                                    }
                                                                </div>
                                                            </div> :
                                                            <div style={{display: 'flex', gap: '20px'}}>
                                                                <CloseIcon/>
                                                                <div style={{margin: 'auto', paddingRight: '50px'}}>
                                                                    {
                                                                        '--:--:--'
                                                                    }
                                                                </div>
                                                            </div>
                                                }
                                            </div>
                                            <div className={styles.route_images_container}>
                                                <div className={styles.container}>
                                                    <Carousel
                                                        showIndicators={false}
                                                        showArrows={true}
                                                        infiniteLoop={true}
                                                        showStatus={false}
                                                        showThumbs={false}
                                                        onClickThumb={(e) => console.log(e)}
                                                        className={styles.mySwiper}
                                                    >
                                                        {workEntriesData.data.filter((e) =>
                                                            e.entry_type === 'AR' && e.building === building.id)
                                                            .map((item) => (
                                                                <div className={styles.imag_container}
                                                                    onClick={(e) => handleImage(item.image)}>
                                                                    <img src={item.image} alt={''}/>
                                                                </div>
                                                            ))}
                                                    </Carousel>
                                                </div>
                                            </div>
                                            <div className={styles.route_images_container}>
                                                <div className={styles.container}>
                                                    <Carousel
                                                        showIndicators={false}
                                                        showArrows={true}
                                                        infiniteLoop={true}
                                                        showStatus={false}
                                                        showThumbs={false}
                                                        onClickThumb={(e) => console.log(e)}
                                                        className={styles.mySwiper}
                                                    >
                                                        {workEntriesData.data.filter((e) =>
                                                            e.entry_type === 'DE' && e.building === building.id)
                                                            .map((item) => (
                                                                <div className={styles.imag_container}
                                                                    onClick={(e) => handleImage(item.image)}>
                                                                    <img src={item.image} alt={''}/>
                                                                </div>
                                                            ))}
                                                    </Carousel>
                                                </div>
                                            </div>
                                            <div className={styles.route_images_container}>
                                                <div className={styles.container}>
                                                    <Carousel
                                                        showIndicators={false}
                                                        showArrows={true}
                                                        infiniteLoop={true}
                                                        showStatus={false}
                                                        showThumbs={false}
                                                        onClickThumb={(e) => console.log(e)}
                                                        className={styles.mySwiper}
                                                    >
                                                        {workEntriesData.data.filter((e) =>
                                                            e.entry_type === 'WO' && e.building === building.id)
                                                            .map((item) => (
                                                                <div className={styles.imag_container}
                                                                    onClick={(e) => handleImage(item.image)}>
                                                                    <img src={item.image} alt={''}/>
                                                                </div>
                                                            ))}
                                                    </Carousel>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        closeAfterTransition
                                        style={{display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'}}
                                    >
                                        <Fade in={open} timeout={500}>
                                            <img
                                                src={image}
                                                alt="asd"
                                                style={{maxHeight: '90%', maxWidth: '90%'}}
                                            />
                                        </Fade>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                        <div className={styles.userAnalytics}>
                            <RouteMap buildings={orderedBuildings()} onHovering={setHovering} hovering={hovering}/>
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
