import {Box, IconButton, TextField, Typography} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {Add, CameraAltRounded, ChevronLeft, ChevronRight} from '@mui/icons-material';
import {defaultBuildingImage} from '@/constants/images';
import styles from './activeroute.module.css';
import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import PublishIcon from '@mui/icons-material/Publish';
import {useSession} from 'next-auth/react';
// eslint-disable-next-line max-len
import {Building, GarbageCollectionSchedule, GarbageType, ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry} from '@/api/models';
import {Api, getDetail, getDetailArray, getList, PaginatedResponse} from '@/api/api';

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

function activeRouteItemData(props: IActiveRouteData): JSX.Element {
    return (
        <Box
            className={styles.active_route_data}
        >
            <h1>{props.name}</h1>
            <br/>
            <p>{props.address}</p>
            <p>{props.garbage}</p>
            <br/>
            {
                props.pdf_guide ?
                    <a href={props.pdf_guide} style={{textDecoration: 'underline'}}>Handleiding</a> :
                    <p></p>
            }
        </Box>
    );
}

function activeRouteItemImage(props: IActiveRouteData): JSX.Element {
    return (
        <Box className={styles.active_route_image_container}>
            {
                props.image ?
                    <img src={props.image} alt={'building'}/> :
                    <img src={defaultBuildingImage} alt={'building'}/>
            }
        </Box>
    );
}


function ActiveRouteItemEntriesUpload(props: {route: IActiveRouteData, type: ('AR' | 'WO' | 'DE')}): JSX.Element {
    const {route, type} = props;
    const {data: session} = useSession();
    // @ts-ignore
    const token = session!.accessToken;
    // @ts-ignore
    const user = session!.userid;

    return (
        <IconButton component="label">
            <Add></Add>
            <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                    e.preventDefault();
                    const promise = new Promise(() => {
                        console.log(e);
                        // @ts-ignore
                        const file = e.target.files[0];
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = async (e) => {
                            if (e.target) {
                                const image = e.target.result;
                                // const fileContents =
                                const entry = {
                                    creator: user,
                                    building: route.building_id,
                                    schedule_assignment: route.schedule_assignment_id,
                                    image: image,
                                    type: type,
                                };
                                console.log(JSON.stringify(entry));
                                const result = await fetch(`${process.env.NEXT_API_URL}schedule_work_entries/`, {
                                    method: 'POST',
                                    body: JSON.stringify(entry),
                                    headers: {
                                        'Authorization': `Bearer  ${token}`,
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                });
                                console.log(result);
                            }
                        };
                    });
                    await promise;
                    // alert(JSON.stringify(entry))
                    // uploadScheduleWorkEntry(props, e.target.value, type);
                } }
            />
        </IconButton>
    );
}

function activeRouteItemEntriesIcon(checked: boolean): JSX.Element {
    if (checked) {
        return (<CheckIcon sx={{color: 'green'}}/>);
    } else {
        return (<CloseIcon sx={{color: 'red'}}/>);
    }
}

function activeRouteItemEntries(props: IActiveRouteData): JSX.Element {
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
                        <td><ActiveRouteItemEntriesUpload route={props} type={'AR'}/></td>
                        <td><ActiveRouteItemEntriesUpload route={props} type={'WO'}/></td>
                        <td><ActiveRouteItemEntriesUpload route={props} type={'DE'}/></td>
                    </tr>
                    <tr>
                        <td>{activeRouteItemEntriesIcon(props.work_entries_done.AR)}</td>
                        <td>{activeRouteItemEntriesIcon(props.work_entries_done.WO)}</td>
                        <td>{activeRouteItemEntriesIcon(props.work_entries_done.DE)}</td>
                    </tr>
                </tbody>
            </table>
        </Box>
    );
}

function uploadIssue(props: IActiveRouteData, issue: string, images: Set<string>): void {
    /* TODO */
    alert(`Added issue for ${props.name}: "${issue}" with ${images.size} images`);
}

function activeRouteItemIssues(props: IActiveRouteData): JSX.Element {
    const [issueText, setIssueText] = React.useState('');
    const [images, setImages] = React.useState(new Set<string>());

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
                <IconButton onClick={(_) => {
                    // Clear issue data
                    setIssueText('');
                    setImages(new Set());
                }}>
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
                            // Add image to images
                            setImages((prev) => new Set(prev.add(e.target.value)));
                        }}
                    />
                    <Typography>{images.size}</Typography>
                </IconButton>
                {/* Upload button */}
                <IconButton onClick={(_) => {
                    if (issueText.length > 0) {
                        // Upload issue
                        uploadIssue(props, issueText, images);
                        // Clear issue data
                        setIssueText('');
                        setImages(new Set());
                    } else {
                        alert('Error: issue message is empty.');
                    }
                }}>
                    <PublishIcon></PublishIcon>
                </IconButton>
            </Box>

        </Box>);
}

function ActiveRouteItem(props: IActiveRouteData): JSX.Element {
    return (
        <div className={styles.grid_test}>
            {/* Building data */}
            {activeRouteItemData(props)}
            {/* Building image */}
            {activeRouteItemImage(props)}
            {/* Work entries */}
            {activeRouteItemEntries(props)}
            {/* Issues */}
            {activeRouteItemIssues(props)}
        </div>
    );
}

export default function ActiveRouteComponent(props: { id: number; }): JSX.Element {
    const {id: id} = props;
    let activeRoutes: IActiveRouteData[] | undefined = [];

    const {data: scheduleAssignment} = getDetail<ScheduleAssignment>(Api.ScheduleAssignmentDetail, id);
    // eslint-disable-next-line max-len
    const {data: scheduleDefinition} = getDetail<ScheduleDefinition>(Api.ScheduleDefinitionDetail, scheduleAssignment?.schedule_definition);
    // eslint-disable-next-line max-len
    const garbageScheduleUrl = `/buildings/:id/for_day/${scheduleAssignment?.assigned_date}/garbage_collection_schedules/`;
    // eslint-disable-next-line max-len
    const {data: garbageSchedules} = getDetailArray<PaginatedResponse<GarbageCollectionSchedule>>(garbageScheduleUrl, scheduleDefinition?.buildings);
    const {data: buildings} = getDetailArray<Building>(Api.BuildingDetail, scheduleDefinition?.buildings);
    const {data: garbageTypes} = getList<GarbageType>(Api.GarbageTypes, {}, {});
    // eslint-disable-next-line max-len
    const {data: scheduleWorkEntries} = getList<ScheduleWorkEntry>(Api.ScheduleWorkEntries, {}, {schedule_assignment: id});

    // @ts-ignore
    if (!scheduleAssignment?.id && scheduleAssignment?.detail) {
        /* During debugging the server starts and restarts a lot, meaning
        that tokens can get invalidated in-between restarts while still staying inside
        the browser cache. This is a catch for that in order to prevent errors.
         */
        return (
            <>
                <p>There was an error: </p><br/>
                <em>{
                    // @ts-ignore
                    scheduleAssignment.detail
                }</em>
            </>);
    }

    // eslint-disable-next-line max-len
    if (scheduleAssignment && scheduleDefinition && (garbageSchedules !== undefined) && (buildings!== undefined) && garbageTypes && scheduleWorkEntries) {
        const garbageNames: {[id: number]: string} = {};
        for (const garbageType of garbageTypes.results) {
            garbageNames[garbageType.id] = garbageType.name;
        }

        const buildingData: {[id: number] : Building} = {};
        for (const building of buildings) {
            buildingData[building.id] = building;
        }

        const buildingGarbageTypes: {[id: number]: Set<string>} = {};
        for (const building of buildings) {
            buildingGarbageTypes[building.id] = new Set();
        }

        for (const paginatedGarbageSchedule of garbageSchedules) {
            for (const garbageSchedule of paginatedGarbageSchedule.results) {
                const garbageName = garbageNames[garbageSchedule.garbage_type];
                buildingGarbageTypes[garbageSchedule.building].add(garbageName);
            }
        }

        activeRoutes = [];
        for (const building of scheduleDefinition.buildings) {
            const SHOW_BUILDING_EVEN_IF_NO_GARBAGE_ASSIGNMENTS_GIVEN = false; // TODO ask about this
            if (SHOW_BUILDING_EVEN_IF_NO_GARBAGE_ASSIGNMENTS_GIVEN || buildingGarbageTypes[building].size > 0) {
                const route: IActiveRouteData = {
                    building_id: building,
                    schedule_assignment_id: id,
                    name: `TODO building name ${building}`,
                    address: buildingData[building].address,
                    garbage: Array.from(buildingGarbageTypes[building]).sort().join(', '),
                    pdf_guide: buildingData[building].pdf_guide,
                    image: buildingData[building].image,
                    work_entries_done: {AR: false, WO: false, DE: false},
                };

                for (const workEntry of scheduleWorkEntries.results) {
                    if (workEntry.building === building) {
                        if (workEntry.entry_type === 'AR') route.work_entries_done.AR = true;
                        if (workEntry.entry_type === 'WO') route.work_entries_done.WO = true;
                        if (workEntry.entry_type === 'DE') route.work_entries_done.DE = true;
                    }
                }
                activeRoutes.push(route);
            }
        }
    }

    if (activeRoutes === undefined) {
        return <p>Loading...</p>;
    }

    if (activeRoutes.length === 0) {
        return <p>This schedule has no entries...</p>;
    }

    return (
        <>
            {/* TODO when implementing, remove the outer div */}
            <div style={{width: '360px', height: '640px', background: 'var(--primary-light)', border: 'solid 3px red'}}>
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
                    }}>
                    {
                        activeRoutes.map((item, i) =>
                            <ActiveRouteItem
                                key={i}
                                building_id={item.building_id}
                                schedule_assignment_id={item.schedule_assignment_id}
                                name={item.name}
                                address={item.address}
                                garbage={item.garbage}
                                pdf_guide={item.pdf_guide}
                                image={item.image}
                                work_entries_done={item.work_entries_done}
                            />
                        )
                    }
                </Carousel>
            </div>
        </>
    );
}

