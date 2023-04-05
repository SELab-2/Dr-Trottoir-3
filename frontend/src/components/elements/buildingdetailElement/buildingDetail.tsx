import * as React from 'react';
import {useEffect} from 'react';
import styles from './buildingdetail.module.css';
import {AddRounded, CreateRounded, ErrorOutline, PictureAsPdf} from '@mui/icons-material';
import {Box, Card, IconButton, Link, List, ListItem, Tooltip, Typography} from '@mui/material';

// TODO add a proper default image
const defaultBuildingImage = 'https://images.pexels.com/photos/162539/architecture-building-amsterdam-blue-sky-162539.jpeg';

// Create fake building data
const dummyBuilding = {
    id: 1,
    name: 'Home Sterre',
    address: 'Krijgslaan 281',
    pdf_guide: 'https://example.com',
    image: null,
    // eslint-disable-next-line max-len
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus a risus lectus. Praesent vel sodales est. Nullam viverra est nisl, vel vehicula ante ornare et. Nulla vel vulputate tortor. Aenean sed consectetur justo. Phasellus aliquam tincidunt gravida.',
    location_group: 1,
    is_active: true,
};

// Create fake syndicus
const dummySyndicus = {id: 3, name: 'Syndicus A'};

// Create fake location group
const dummyLocationGroup = {id: 1, name: 'Gent'};

// Create face garbage collection schedules
// eslint-disable-next-line max-len
const dummyGarbageCollectionSchedules: { id: number; for_day: string; building: number; type: string; issue: string; }[] = [];
for (let i = 0; i <= 200; i++) {
    let issue = '';
    // randomly give the garbage collection schedule an issue
    if (Math.random() < 0.1) {
        issue = 'Test issue';
    }
    const schedule = {
        id: i,
        for_day: `2022-01-${i}`,
        building: 1,
        type: 'PMD',
        issue: issue,
    };
    dummyGarbageCollectionSchedules.push(schedule);
}

interface IScheduleGarbageListItem {
  id: number,
  type: string,
  date: string,
  issue: string,
}

// eslint-disable-next-line require-jsdoc
export default function BuildingDetail(props: { id: number }) {
    // eslint-disable-next-line no-unused-vars
    const {id} = props;

    // eslint-disable-next-line require-jsdoc
    function createScheduleEntryNote(id: number) {
    // TODO make this a proper function once API is available,
    //  see https://mui.com/material-ui/react-dialog#form-dialogs
    // eslint-disable-next-line no-undef
        alert(`Changing note for entry ${id}`);
    }


    // eslint-disable-next-line require-jsdoc
    function createScheduleWarningSymbol(id: number, text: string) {
        const [issueExists, setIssueExists] = React.useState(false);
        useEffect(() => setIssueExists(text.length > 0), []);

        return (
            <>
                {
                    issueExists ?
                        <>
                            <Tooltip title={text} arrow>
                                <ErrorOutline fontSize="small"/>
                            </Tooltip>
                            <IconButton onClick={() => createScheduleEntryNote(id)}>
                                <CreateRounded fontSize="small"/>
                            </IconButton>
                        </> :
                        <IconButton onClick={() => createScheduleEntryNote(id)}>
                            <AddRounded fontSize="small"/>
                        </IconButton>
                }
            </>
        );
    }


    // eslint-disable-next-line require-jsdoc
    function scheduleGarbageListItem(schedule: IScheduleGarbageListItem) {
    // @ts-ignore
        return (
            <ListItem
                key={schedule.id}
                sx={
                    {
                        display: 'flex',
                        flexGrow: 1,
                        flexDirection: 'row',
                        alignItems: 'stretch',
                        justifyContent: 'space-between',
                        verticalAlign: 'middle',
                    }}>
                <Card sx={{
                    width: '100%', height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Box sx={{
                        display: 'flex', width: '100%', height: '100%',
                        background: 'var(--secondary-light)', alignItems: 'center',
                    }}>
                        {/* Schedule type */}
                        <Box sx={{
                            display: 'flex', width: '33%', height: '100%',
                            flexGrow: 1, fontWeight: 'bold',
                            paddingLeft: '10px', alignItems: 'center',
                        }}>
                            {schedule.type}
                        </Box>
                        {/* Schedule date */}
                        <Box sx={{
                            display: 'flex', width: '33%', height: '100%',
                            flexGrow: 1, justifyContent: 'center',
                            alignItems: 'center', fontSize: '14px',
                        }}>
                            {schedule.date}
                        </Box>
                        {/* Schedule issue icons */}
                        <Box sx={{
                            display: 'flex', width: '33%', height: '100%',
                            flexGrow: 1, justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>
                            {createScheduleWarningSymbol(schedule.id, schedule.issue)}
                        </Box>
                    </Box>
                </Card>
            </ListItem>
        );
    }

    // eslint-disable-next-line require-jsdoc
    function createBuildingManualElement(path: string) {
        if (!path || path.length == 0) {
            return (<></>);
        }
        return (
            <Link href={path} className={styles.building_data_manual}>
        Handleiding<PictureAsPdf fontSize="small"></PictureAsPdf>
            </Link>
        );
    }

    return (
    // TODO: Temporarily add this to fix dimensions,
    //  once combined the outer div should be removed

        <Box className={styles.full}>
            {/* Top row */}
            <Box className={styles.top_row_container}
                sx={{background: 'var(--secondary-light)'}}>
                {/* Building data container */}
                <Box className={styles.building_data_container}>
                    <Typography variant="h1" className={styles.building_data_header}>
                        {dummyBuilding.name}
                    </Typography>
                    <Box className={styles.building_data_container_data}>
                        <Typography className={styles.building_data_data}>
                            {dummyLocationGroup.name}
                        </Typography>
                        <Typography className={styles.building_data_data}>
                            {dummyBuilding.address}
                        </Typography>
                        <Typography className={styles.building_data_data}>
                            {dummySyndicus.name}
                        </Typography>
                    </Box>
                    {createBuildingManualElement(dummyBuilding.pdf_guide)}
                </Box>

                {/* Building description container */}
                <Box className={styles.building_desc_container}>
                    <Typography>{dummyBuilding.description}</Typography>
                </Box>

                {/* Building image container */}
                <Box className={styles.building_imag_container}>
                    <img src={dummyBuilding.image ?
                        dummyBuilding.image :
                        defaultBuildingImage}
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
                        {dummyGarbageCollectionSchedules.map((schedule) =>
                            scheduleGarbageListItem({
                                id: schedule.id, date: schedule.for_day,
                                type: schedule.type, issue: schedule.issue,
                            })
                        )}
                    </List>
                </Box>

                {/* Garbage schedule calendar */}
                <Box style={{background: 'limegreen', width: '100%'}}>
            Calendar here
                </Box>
            </Box>

        </Box>
    );
}
