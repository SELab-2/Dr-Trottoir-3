import styles from './buildingdetail.module.css';
import {Box, Link, List, Modal, Typography} from '@mui/material';
import {Building, GarbageCollectionSchedule, GarbageType, Issue, LocationGroup, User} from '@/api/models';
import {PictureAsPdf} from '@mui/icons-material';
import {
    getBuildingDetail, getBuildingDetailGarbageCollectionSchedules, getBuildingDetailIssues,
    getGarbageTypesList, getLocationGroupDetail, getUsersList, useAuthenticatedApi} from '@/api/api';
import {defaultBuildingImage} from '@/constants/images';
import {useSession} from 'next-auth/react';
import ScheduleGarbageListItem from './scheduleGarbageListItem';
import Button from '@mui/material/Button';
import React, {useEffect} from 'react';
import BuildingIssueListItem from '@/components/elements/buildingdetailElement/buildingIssueListItem';

interface IBuildingDetail {
  id: number,
  location_group: string,
  name: string,
  address: string,
  pdf_guide: string | null,
  description: string | null
  image: string | null,
  syndicus: string,
  schedules: IScheduleGarbageListItem[],
  issues: Issue[],
}

interface IScheduleGarbageListItem {
  id: number,
  type: string,
  date: string,
  note: string,
}

/* TODO list
 * - Remove building description, in detail view replace this with a map of the coordinates
 * - Add way of finding syndicus by building id
 * - Add building name to model
 */

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
export default function BuildingDetail(props: { id: number }): JSX.Element {
    const {id} = props;

    const [buildingDetail, setBuildingDetail] = React.useState<IBuildingDetail | undefined>(undefined);
    const [issuesModalOpen, setIssuesModalOpen] = React.useState(false);
    const handleIssueModalOpen = ()=> setIssuesModalOpen(true);
    const handleIssueModalClose = ()=> setIssuesModalOpen(false);

    const {data: session} = useSession();

    const [building, setBuilding] = useAuthenticatedApi<Building>();
    const [location, setLocation] = useAuthenticatedApi<LocationGroup>();
    const [schedules, setSchedules] = useAuthenticatedApi<GarbageCollectionSchedule[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [issues, setIssues] = useAuthenticatedApi<Issue[]>();
    const [syndici, setSyndici] = useAuthenticatedApi<User[]>();

    // Get building data
    useEffect(()=>{
        getBuildingDetail(session, setBuilding, id);
    }, []);

    // Get location group
    useEffect(()=> {
        if (building) {
            getLocationGroupDetail(session, setLocation, building.data.location_group);
        }
    }, [building]);

    // Get schedules
    useEffect(() => {
        getBuildingDetailGarbageCollectionSchedules(session, setSchedules, id);
    }, []);

    // Get garbage types
    useEffect(()=> {
        getGarbageTypesList(session, setGarbageTypes);
    }, []);

    // Get issues
    useEffect(()=> {
        getBuildingDetailIssues(session, setIssues, id);
    }, []);

    useEffect(()=> {
        getUsersList(session, setSyndici, {'syndicus__buildings': id}, {});
    }, []);

    let issuesModalButtonText: string = '0 issues remaining';

    useEffect(() => {
        if (session && building && location && schedules && garbageTypes && issues && syndici) {
            const garbageNames: {[id: number]: string} = {};
            for (const garbageType of garbageTypes.data) {
                garbageNames[garbageType.id] = garbageType.name;
            }
            const scheduleItems: IScheduleGarbageListItem[] = schedules.data.map((schedule) => {
                const item: IScheduleGarbageListItem = {
                    id: schedule.id,
                    type: garbageNames[schedule.garbage_type],
                    date: schedule.for_day,
                    note: schedule.note,
                };
                return item;
            });
            const syndiciNames=syndici.data.map(
                (syndicus) => `${syndicus.last_name} ${syndicus.first_name}`).
                sort().join(', ');
            const detail = {
                id: id,
                location_group: location.data.name,
                name: building.data.name ? building.data.name : building.data.address,
                address: building.data.address,
                pdf_guide: building.data.pdf_guide,
                description: `TODO insert map with coordinates ${building.data.longitude} ${building.data.latitude}`,
                image: building.data.image,
                syndicus: syndiciNames,
                schedules: scheduleItems,
                issues: issues.data,
            };
            setBuildingDetail(detail);
            const issueCount = issues.data.length;
            if (issues.data.length > 0) {
                issuesModalButtonText = `${issueCount}+ issues remaining`;
            }
        }
    },
    [building, location, schedules, garbageTypes, issues, syndici]);


    if (!buildingDetail) {
        return <p>Loading...</p>;
    }

    return (

        <Box className={styles.full}>
            {/* Top row */}
            <Box className={styles.top_row_container}
                sx={{background: 'var(--secondary-light)'}}>
                {/* Building data container */}
                <Box className={styles.building_data_container}>
                    <Typography variant="h1" className={styles.building_data_header}>
                        {buildingDetail.name}
                    </Typography>
                    <br/>
                    <Box className={styles.building_data_container_data}>
                        <Typography className={styles.building_data_data}>
                            {buildingDetail.location_group}
                        </Typography>
                        <Typography className={styles.building_data_data}>
                            {buildingDetail.address}
                        </Typography>
                        <Typography className={styles.building_data_data}>
                            {buildingDetail.syndicus}
                        </Typography>
                        <br/>
                        <BuildingDetailManualLink path={buildingDetail.pdf_guide}/>
                        {/* Button to open the issue modal*/}
                        <Button onClick={handleIssueModalOpen}>{issuesModalButtonText}</Button>
                    </Box>
                </Box>

                {/* Building description container */}
                <Box className={styles.building_desc_container}>
                    <Typography>{buildingDetail.description}</Typography>
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
                                type={schedule.type}
                                date={schedule.date}
                                note={schedule.note}
                            />
                        )}
                    </List>
                </Box>

                {/* Garbage schedule calendar */}
                <Box style={{background: 'limegreen', width: '100%'}}>
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
                                <BuildingIssueListItem issue={issue} key={issue.id}/>
                            )
                        }
                    </List>
                </Box>
            </Modal>
        </Box>
    );
}
