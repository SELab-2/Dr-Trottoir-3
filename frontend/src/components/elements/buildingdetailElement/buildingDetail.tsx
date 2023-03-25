import * as React from 'react';
import styles from './buildingdetail.module.css';
import {AddRounded, CreateRounded, ErrorOutline, PictureAsPdf}
  from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import {Box, Card, IconButton, Link, List, ListItem, Table, TableBody,
  TableCell, TableRow, Typography} from '@mui/material';

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
    if (text.length == 0) {
      return (
        <IconButton onClick={() => createScheduleEntryNote(id)}>
          <AddRounded fontSize="small"/>
        </IconButton>
      );
    }
    return (
      <>
        <Box sx={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Tooltip title={text} arrow>
            <ErrorOutline fontSize="small"/>
          </Tooltip>
          <IconButton onClick={() => createScheduleEntryNote(id)}>
            <CreateRounded fontSize="small"/>
          </IconButton>
        </Box>
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
          <Table
            sx={{tableLayout: 'fixed', width: '100%',
              background: 'var(--secondary-light)'}}>
            <TableBody>
              <TableRow>
                <TableCell align='left' sx={{width: '33%', fontWeight: 'bold'}}>
                  {schedule.type}
                </TableCell>
                <TableCell align='justify' sx={{width: '33%'}}>
                  {schedule.date}
                </TableCell>
                <TableCell align={'right'} sx={{width: '33%'}}>
                  {createScheduleWarningSymbol(schedule.id, schedule.issue)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </ListItem>
    );
  }

  // eslint-disable-next-line require-jsdoc
  function createBuildingManualElement(path: string) {
    if (path.length == 0) {
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
    <div style={{
      width: '100vw',
      height: '100vh',
      border: '1px solid red',
      background: 'var(--primary-light)',
    }}
    >

      <Box className={styles.full}>
        {/* Top row */}
        <Box className={styles.top_row_container}>
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
    </div>
  );
}
