import {Box, IconButton, TextField, Typography} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {Add, CameraAltRounded, ChevronLeft, ChevronRight} from '@mui/icons-material';
import {defaultBuildingImage} from '@/constants/images';
import styles from './activeroute.module.css';
import React, {useEffect} from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import PublishIcon from '@mui/icons-material/Publish';
import {useSession} from 'next-auth/react';
import {Building, GarbageCollectionSchedule, GarbageType, Issue,
    ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry} from '@/api/models';
import {ApiData, getBuildingsList, getGarbageCollectionsSchedulesList, getGarbageTypesList,
    getScheduleAssignmentDetail, getScheduleDefinitionDetail, getScheduleWorkEntriesList,
    postIssue, postIssueImage, postScheduleWorkEntry, useAuthenticatedApi} from '@/api/api';
import ErrorPage from '@/containers/ErrorPage';

interface IActiveRouteData {
  building_id: number,
  schedule_assignment_id: number,
  name: string,
  address: string,
  garbage: string,
  pdf_guide: string | null | undefined,
  image: string | null | undefined,
  work_entries_done: { AR: boolean, WO: boolean, DE: boolean }
}

export default function ActiveRouteComponent(props: { id: number; }): JSX.Element {
    const {id: id} = props;
    const {data: session} = useSession();

    const [activeRoutes, setActiveRoutes] = React.useState<IActiveRouteData[] | undefined>(undefined);
    const [scheduleAssignment, setScheduleAssignment] = useAuthenticatedApi<ScheduleAssignment>();
    const [scheduleDefinition, setScheduleDefinition] = useAuthenticatedApi<ScheduleDefinition>();
    const [garbageSchedules, setGarbageSchedules] = useAuthenticatedApi<GarbageCollectionSchedule[]>();
    const [buildings, setBuildings] = useAuthenticatedApi<Building[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [scheduleWorkEntries, setScheduleWorkEntries] = useAuthenticatedApi<ScheduleWorkEntry[]>();
    const [sessionError, setSessionError] = React.useState(0);

    // Get schedule assignment
    useEffect(() => {
        getScheduleAssignmentDetail(session, setScheduleAssignment, id);
    }, [session]);

    // Get schedule definition
    useEffect(()=> {
        if (scheduleAssignment && scheduleAssignment.success) {
            getScheduleDefinitionDetail(session, setScheduleDefinition, scheduleAssignment.data.schedule_definition);
        }
    }, [session, scheduleAssignment]);

    // Get garbage schedules
    useEffect(() => {
        if (scheduleAssignment && scheduleDefinition && scheduleAssignment.success && scheduleDefinition.success) {
            const buildings = scheduleDefinition.data.buildings.map((building) => building.toString()).join(',');
            getGarbageCollectionsSchedulesList(session, setGarbageSchedules,
                {for_day: scheduleAssignment.data.assigned_date, building__in: buildings});
        }
    }, [session, scheduleAssignment, scheduleDefinition]);

    // Get buildings
    useEffect(()=> {
        getBuildingsList(session, setBuildings, {}, {});
    }, [session]);

    // Get garbage types
    useEffect(()=> {
        getGarbageTypesList(session, setGarbageTypes, {}, {});
    }, [session]);

    // Get already existing schedule work entries
    useEffect(() => {
        getScheduleWorkEntriesList(session, setScheduleWorkEntries, {schedule_assignment: id}, {});
    }, [session]);

    useEffect(() => {
        if (!session) {
            setSessionError(403);
        } else if (scheduleAssignment && !scheduleAssignment.success) {
            setSessionError(scheduleAssignment.status);
        } else if (scheduleDefinition && !scheduleDefinition.success) {
            setSessionError(scheduleDefinition.status);
        } else if (garbageSchedules && ! garbageSchedules.success) {
            setSessionError(garbageSchedules.status);
        } else if (buildings && !buildings.success) {
            setSessionError(buildings.status);
        } else if (garbageTypes && !garbageTypes.success) {
            setSessionError(garbageTypes.status);
        } else if (scheduleWorkEntries && !scheduleWorkEntries.success) {
            setSessionError(scheduleWorkEntries.status);
            // eslint-disable-next-line max-len
        } else if (scheduleAssignment && scheduleDefinition && garbageSchedules && buildings && garbageTypes && scheduleWorkEntries) {
            const garbageNames: { [id: number]: string } = {};
            for (const garbageType of garbageTypes.data) {
                garbageNames[garbageType.id] = garbageType.name;
            }

            const buildingData: { [id: number]: Building } = {};
            for (const building of buildings.data) {
                buildingData[building.id] = building;
            }

            const buildingGarbageTypes: { [id: number]: Set<string> } = {};
            for (const building of buildings.data) {
                buildingGarbageTypes[building.id] = new Set();
            }

            for (const garbageSchedule of garbageSchedules.data) {
                const garbageName = garbageNames[garbageSchedule.garbage_type];
                buildingGarbageTypes[garbageSchedule.building].add(garbageName);
            }

            const routes = [];
            for (const building of scheduleDefinition.data.buildings) {
                // Only add entries if they have one or more garbage to pick up that day
                if (buildingGarbageTypes[building].size > 0) {
                    const route: IActiveRouteData = {
                        building_id: building,
                        schedule_assignment_id: id,
                        name: buildingData[building].name,
                        address: buildingData[building].address,
                        garbage: Array.from(buildingGarbageTypes[building]).sort().join(', '),
                        pdf_guide: buildingData[building].pdf_guide,
                        image: buildingData[building].image,
                        work_entries_done: {AR: false, WO: false, DE: false},
                    };

                    for (const workEntry of scheduleWorkEntries.data) {
                        if (workEntry.building === building) {
                            if (workEntry.entry_type === 'AR') route.work_entries_done.AR = true;
                            if (workEntry.entry_type === 'WO') route.work_entries_done.WO = true;
                            if (workEntry.entry_type === 'DE') route.work_entries_done.DE = true;
                        }
                    }
                    routes.push(route);
                }
            }
            setActiveRoutes(routes);
        }
    }, [scheduleAssignment, scheduleDefinition, garbageSchedules, buildings, garbageTypes, scheduleWorkEntries]);

    if (!session || sessionError !== 0) {
        return <ErrorPage status={sessionError}/>;
    }

    if (activeRoutes === undefined) {
        return <p>Loading...</p>;
    }

    if (activeRoutes.length === 0) {
        return <p>This schedule has no entries...</p>;
    }

    // @ts-ignore
    const user = session.userid;


    async function uploadIssue(route: IActiveRouteData, message: string, images: Set<File>): Promise<void> {
        const issue = {
            resolved: false,
            message: message,
            building: route.building_id,
            // @ts-ignore
            from_user: user,
            approval_user: null,
        };
        // Post the issue
        postIssue(session, issue, (response: ApiData<Issue>) => {
            if (response.success) {
                for (const image of Array.from(images)) {
                    const formData = new FormData();
                    formData.append('image', image, image.name);
                    formData.append('issue', response.data.id.toString());
                    postIssueImage(session, formData);
                }
            }
        });
    }

    async function uploadScheduleWorkEntry(route: IActiveRouteData, type: string, image: File) {
        const timestamp = new Date(image.lastModified);
        const formData = new FormData();
        formData.append('image', image, image.name);
        // @ts-ignore
        formData.append('creator', user);
        formData.append('building', route.building_id.toString());
        formData.append('entry_type', type);
        formData.append('schedule_assignment', route.schedule_assignment_id.toString());
        formData.append('creation_timestamp', timestamp.toISOString());
        postScheduleWorkEntry(session, formData, (response: ApiData<ScheduleWorkEntry>) => {
            if (response.success) {
                getScheduleWorkEntriesList(session, setScheduleWorkEntries, {schedule_assignment: id}, {});
            }
        });
    }

    // Button for a single entry type (AR, WO, DE)
    function ActiveRouteItemEntriesUpload(props: { route: IActiveRouteData, type: ('AR' | 'WO' | 'DE') }): JSX.Element {
        const {route, type} = props;
        return (
            <form encType="multipart/form-data">
                <IconButton component="label">
                    <Add></Add>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={async (e) => {
                        // @ts-ignore
                            const image = e.target.files[0];
                            await uploadScheduleWorkEntry(route, type, image);
                        }}
                    />
                </IconButton>
            </form>
        );
    }

    // Checkmark for a single type
    function ActiveRouteItemEntriesIcon(props: { checked: boolean }): JSX.Element {
        if (props.checked) {
            return (<CheckIcon sx={{color: 'green'}}/>);
        } else {
            return (<CloseIcon sx={{color: 'red'}}/>);
        }
    }

    // Table containing the buttons for uploading schedule work entry images + checkmarks
    function ActiveRouteItemEntries(props: { route: IActiveRouteData }): JSX.Element {
        const {route} = props;
        return (
            <Box
                className={styles.active_route_entries}
            >
                <table>
                    <tbody>
                        <tr>
                            <td>Aankomst</td>
                            <td>Afvalplaats</td>
                            <td>Vertrek</td>
                        </tr>
                        <tr>
                            <td><ActiveRouteItemEntriesUpload route={route} type={'AR'}/></td>
                            <td><ActiveRouteItemEntriesUpload route={route} type={'WO'}/></td>
                            <td><ActiveRouteItemEntriesUpload route={route} type={'DE'}/></td>
                        </tr>
                        <tr>
                            <td><ActiveRouteItemEntriesIcon checked={route.work_entries_done['AR']}/></td>
                            <td><ActiveRouteItemEntriesIcon checked={route.work_entries_done['WO']}/></td>
                            <td><ActiveRouteItemEntriesIcon checked={route.work_entries_done['DE']}/></td>
                        </tr>
                    </tbody>
                </table>
            </Box>
        );
    }

    // Issue box
    function ActiveRouteItemIssues(props: { route: IActiveRouteData }): JSX.Element {
        const [issueText, setIssueText] = React.useState('');
        const [images, setImages] = React.useState(new Set<File>());

        function clearIssue() {
            setIssueText('');
            setImages(new Set());
        }

        return (
            <Box
                className={styles.active_route_issue}
                style={{background: 'var(--secondary-light)', color: 'var(--secondary-dark)', display: 'inline-block'}}
            >
                {/* Input text */}
                <TextField
                    aria-label="minimum height"
                    minRows={3}
                    maxRows={3}
                    placeholder={'Issue'}
                    value={issueText}
                    multiline={true}
                    style={{width: '100%', height: '75%', resize: 'none'}}
                    onChange={(e) => setIssueText(e.target.value)}
                />
                <br/>
                {/* Buttons */}
                <Box style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    {/* Clear button */}
                    <IconButton onClick={clearIssue}>
                        <CancelIcon></CancelIcon>
                    </IconButton>

                    {/* Camera button */}
                    <IconButton
                        component="label"
                    >
                        <CameraAltRounded></CameraAltRounded>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                            // @ts-ignore
                                const image = e.target.files[0];
                                // Add image to images
                                setImages((prev) => new Set(prev.add(image)));
                            }}
                        />
                        <Typography>{images.size}</Typography>
                    </IconButton>
                    {/* Upload button */}
                    <IconButton onClick={async (_) => {
                        if (issueText.length > 0) {
                            // Upload issue
                            await uploadIssue(props.route, issueText, images);
                            // Clear issue data
                            clearIssue();
                        } else {
                            alert('Error: issue message is empty.');
                        }
                    }}>
                        <PublishIcon></PublishIcon>
                    </IconButton>
                </Box>

            </Box>);
    }

    // View of a single route item
    function ActiveRouteItem(props: { route: IActiveRouteData }): JSX.Element {
        const {route} = props;
        return (
            <div className={styles.grid_test}>
                {/* Building data */}
                <Box
                    className={styles.active_route_data}
                >
                    <h1>{route.name}</h1>
                    <br/>
                    <p>{route.address}</p>
                    <p>{route.garbage}</p>
                    <br/>
                    {
                        route.pdf_guide ?
                            <a href={route.pdf_guide} style={{textDecoration: 'underline'}}>Handleiding</a> :
                            <p></p>
                    }
                </Box>
                {/* Building image */}
                <Box className={styles.active_route_image_container}>
                    {
                        route.image ?
                            <img src={route.image} alt={'building'}/> :
                            <img src={defaultBuildingImage} alt={'building'}/>
                    }
                </Box>
                {/* Work entries */}
                <ActiveRouteItemEntries route={route}/>
                {/* Issues */}
                <ActiveRouteItemIssues route={route}/>
            </div>
        );
    }

    return (
        <>
            <Carousel
                NextIcon={<ChevronRight/>}
                PrevIcon={<ChevronLeft/>}
                autoPlay={false}
                animation={'slide'}
                indicators={false}
                navButtonsAlwaysVisible={true}
                fullHeightHover={false}
                swipe={false}
                navButtonsWrapperProps={{
                    style: {
                        // Move them to the middle of the top row
                        bottom: 'unset',
                        top: '5%',
                    },
                }}
            >
                {
                    activeRoutes.map((route) =>
                        <ActiveRouteItem
                            key={route.building_id}
                            route={route}
                        />
                    )
                }
            </Carousel>
        </>
    );
}

