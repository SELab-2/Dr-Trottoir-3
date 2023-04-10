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
import useSWR from 'swr';
import {Building, GarbageCollectionSchedule, GarbageType, ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry} from '@/api/models';
import {Api, getDetail, getDetailArray, getList, PaginatedResponse} from '@/api/api';

/**
 * TODO
 * - Add API
 * - Fix the TODO in activeroute.module.css
 */

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

function uploadScheduleWorkEntry(props: IActiveRouteData, image: string, type: ('AR' | 'WO' | 'DE')): void {
    const entry = {
        creator: 1, // TODO, this is the current user
        building: props.building_id,
        schedule_assignment: props.schedule_assignment_id,
        image: image,
        type: type,
    };
    alert(`Posted ${type} entry for building ${entry.building}`);
}

function activeRouteItemEntriesUpload(props: IActiveRouteData, type: ('AR' | 'WO' | 'DE')): JSX.Element {
    return (
        <IconButton component="label">
            <Add></Add>
            <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e): void => {
                    uploadScheduleWorkEntry(props, e.target.value, type);
                }}
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
                        <td>{activeRouteItemEntriesUpload(props, 'AR')}</td>
                        <td>{activeRouteItemEntriesUpload(props, 'WO')}</td>
                        <td>{activeRouteItemEntriesUpload(props, 'DE')}</td>
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
                placeholder={'Issue'}
                value={issueText}
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
    console.log(`Loading page for id ${id}`);

    let activeRoutes: IActiveRouteData[] | undefined = undefined;
    const {data: session} = useSession();
    const {data: scheduleAssignment} = getDetail<ScheduleAssignment>(Api.ScheduleAssignmentDetail, id);
    // eslint-disable-next-line max-len
    const {data: scheduleDefinition} = getDetail<ScheduleDefinition>(Api.ScheduleDefinitionDetail, scheduleAssignment?.schedule_definition);

    const {data: buildings} = getDetailArray<Building>(Api.BuildingDetail, scheduleDefinition?.buildings);
    const buildingIds = (buildings !== undefined) ? buildings.map((building) => building.id) : undefined;
    // eslint-disable-next-line max-len
    const buildingGarbageSchedulesUrl = `${Api.BuildingDetail}/for_day/${scheduleAssignment?.assigned_date}/garbage_collection_schedules/`;
    // eslint-disable-next-line max-len
    const {data: garbageSchedules} = getDetailArray<PaginatedResponse<GarbageCollectionSchedule>>(buildingGarbageSchedulesUrl, buildingIds);
    const {data: garbageTypes} = getList<GarbageType>(Api.GarbageTypes, {}, {});
    const {data: workEntries} = getList<ScheduleWorkEntry>(Api.ScheduleWorkEntries, {}, {schedule_assignment: id});

    // eslint-disable-next-line max-len
    console.log(`schedule assignment ${JSON.stringify(scheduleAssignment)}`);
    console.log(`schedule definition ${JSON.stringify(garbageSchedules)}`);
    // scheduleDefinition && (buildings !== undefined) && (garbageSchedules !== undefined) && garbageTypes && workEntries )
    if (session && scheduleAssignment && scheduleDefinition && (buildings !== undefined) && (garbageSchedules !== undefined) && garbageTypes && workEntries) {
        activeRoutes = [];
        const garbageNames: {[id: number]: string} = {};
        for (const garbageType of garbageTypes.results) {
            garbageNames[garbageType.id] = garbageType.name;
        }

        const buildingGarbageNames:{[id: number]: string} = {};
        for (const paginatedGarbageSchedule of garbageSchedules) {
            const names: Set<string> = new Set();
            let building = -1;
            for (const garbageSchedule of paginatedGarbageSchedule.results) {
                building = garbageSchedule.building;
                const garbageId = garbageSchedule.garbage_type;
                names.add(garbageNames[garbageId]);
            }
            buildingGarbageNames[building] = Array.from(names).sort().join(', ');
        }

        for (const building of buildings) {
            const activeRoute: IActiveRouteData = {
                building_id: building.id,
                schedule_assignment_id: id,
                name: 'TODO add building name',
                address: building.address,
                garbage: buildingGarbageNames[building.id],
                pdf_guide: building.pdf_guide,
                image: building.image,
                work_entries_done: {AR: false, WO: false, DE: false},
            };

            for (const workEntry of workEntries.results) {
                if (workEntry.building === building.id) {
                    if (workEntry.entry_type === 'AR') activeRoute.work_entries_done.AR = true;
                    if (workEntry.entry_type === 'WO') activeRoute.work_entries_done.WO = true;
                    if (workEntry.entry_type === 'DE') activeRoute.work_entries_done.DE = true;
                }
            }
            activeRoutes.push(activeRoute);
            console.log(activeRoutes);
        }
    }

    if (activeRoutes === undefined) {
        return <p>Loading...</p>;
    }

    // TODO use API instead of dummy items
    const dummyItems: IActiveRouteData[] = [
        {
            building_id: 1,
            schedule_assignment_id: 1,
            name: 'Building Sterre',
            address: 'Adres 10',
            garbage: 'PMD',
            pdf_guide: null,
            image: null,
            work_entries_done: {AR: true, WO: true, DE: false},
        },
        {
            building_id: 2,
            schedule_assignment_id: 2,
            name: 'Building Zwijnaarde',
            address: 'Adres 20',
            garbage: 'Plastiek',
            pdf_guide: 'https://www.example.com',
            // eslint-disable-next-line max-len
            image: 'https://media.architecturaldigest.com/photos/5d3f6c8084a5790008e99f37/master/w_3000,h_2123,c_limit/GettyImages-1143278588.jpg',
            work_entries_done: {AR: false, WO: false, DE: false},
        },
    ];

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

const sessionToken = () => {
    const {data: session} = useSession();
    // @ts-ignore
    return session ? session.accessToken : '';
};

const headers = (token: string) => {
    // eslint-disable-next-line no-undef
    return {headers: {'Authorization': `Bearer  ${token}`}} as RequestInit;
};


async function fetchDetail<T>(url: string, token: string) {
    const apiUrl = `${process.env.NEXT_API_URL}${url}`;
    return (await fetch(apiUrl, headers(token)).then((response) => response.json())) as T;
}


// TODO issue https://stackoverflow.com/questions/74567152/swr-keep-getting-the-same-data-through-the-loop

async function scheduleAssignmentFetch(args: any[]) {
    const [scheduleAssignmentId, token] = args;
    const scheduleAssignment = await fetchDetail<ScheduleAssignment>(
        `/schedule_assignments/${scheduleAssignmentId}/`, token);
    const scheduleDefinition = await fetchDetail<ScheduleDefinition>(
        `/schedule_definitions/${scheduleAssignment.schedule_definition}/`, token);
    const results: IActiveRouteData[] = [];
    for (const building of scheduleDefinition.buildings) {
        console.log(`${building} / ${scheduleDefinition.buildings}`);
        const buildingData = await fetchDetail<Building>(`/buildings/${building}/`, token);
        let garbageSchedules = await fetchDetail<GarbageCollectionSchedule[]>(
            `/buildings/${building}/garbage_collection_schedules/`, token);
        garbageSchedules = garbageSchedules.filter((schedule) => schedule.for_day == scheduleAssignment.assigned_date);
        const garbageTypeNames: string[] = [];
        for (const garbageSchedule of garbageSchedules) {
            const garbageType = await fetchDetail<GarbageType>(
                `/garbage_types/${garbageSchedule.garbage_type}/`, token);
            if (!garbageTypeNames.includes(garbageType.name)) {
                garbageTypeNames.push(garbageType.name);
            }
        }
        const garbageTypeStr = garbageTypeNames.sort().join(', ');
        const routeData: IActiveRouteData = {
            building_id: building,
            schedule_assignment_id: scheduleAssignmentId,
            name: 'BUILDING NAME TODO', // buildingData.name
            address: buildingData.address,
            pdf_guide: buildingData.pdf_guide,
            image: buildingData.image,
            work_entries_done: {AR: false, WO: false, DE: false},
            garbage: garbageTypeStr,
        };

        const scheduleWorkEntriesPaginated = await fetchDetail<PaginatedResponse<ScheduleWorkEntry>>(
            `/schedule_work_entries/?schedule_assignment=${scheduleAssignmentId}&building=${building}`, token);
        for (const scheduleWorkEntry of scheduleWorkEntriesPaginated.results) {
            if (scheduleWorkEntry.entry_type === 'AR') routeData.work_entries_done.AR = true;
            else if (scheduleWorkEntry.entry_type === 'WO') routeData.work_entries_done.WO = true;
            else if (scheduleWorkEntry.entry_type === 'DE') routeData.work_entries_done.DE = true;
        }
        results.push(routeData);
    }
    console.log(results);
    return results;
}

function useActiveRoute(scheduleAssignmentId: number) {
    const token = sessionToken();
    return useSWR<IActiveRouteData[]>([scheduleAssignmentId, token], scheduleAssignmentFetch);
}
