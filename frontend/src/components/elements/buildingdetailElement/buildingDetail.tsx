import styles from './buildingdetail.module.css';
import {Box, Link, List, Modal, Typography} from '@mui/material';
import {Building, GarbageCollectionSchedule, GarbageType, Issue, LocationGroup} from '@/api/models';
import {PictureAsPdf} from '@mui/icons-material';
import {Api, getDetail, getList, PaginatedResponse} from '@/api/api';
import {defaultBuildingImage} from '@/constants/images';
import {useSession} from 'next-auth/react';
import ScheduleGarbageListItem from './scheduleGarbageListItem';
import Button from '@mui/material/Button';
import React from 'react';
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

    let buildingDetail: IBuildingDetail | undefined = undefined;
    const [issuesModalOpen, setIssuesModalOpen] = React.useState(false);
    const handleIssueModalOpen = ()=> setIssuesModalOpen(true);
    const handleIssueModalClose = ()=> setIssuesModalOpen(false);

    const {data: session} = useSession();

    const {data: building} = getDetail<Building>(Api.BuildingDetail, id);
    const {data: location} = getDetail<LocationGroup>(Api.LocationGroupDetail, building?.id);
    const {data: schedules} = getDetail<PaginatedResponse<GarbageCollectionSchedule>>(
        Api.BuildingDetailGarbageCollectionSchedules, id);
    const {data: garbageTypes} = getList<GarbageType>(Api.GarbageTypes, {}, {});
    const {data: issues} = getList<Issue>(Api.Issues, {}, {resolved: false, building: id});

    // @ts-ignore
    if (!building?.id && building?.detail) {
        /* During debugging the server starts and restarts a lot, meaning
        that tokens can get invalidated in-between restarts while still staying inside
        the browser cache. This is a catch for that in order to prevent errors.
         */
        return (
            <>
                <p>There was an error:</p>
                <em>{
                    // @ts-ignore
                    building.detail
                }</em>
            </>);
    }

    if (session && building && location && schedules && garbageTypes && issues) {
        const garbageNames: {[id: number]: string} = {};
        for (const garbageType of garbageTypes.results) {
            garbageNames[garbageType.id] = garbageType.name;
        }
        const scheduleItems: IScheduleGarbageListItem[] = schedules.results.map((schedule) => {
            const item: IScheduleGarbageListItem = {
                id: schedule.id,
                type: garbageNames[schedule.garbage_type],
                date: schedule.for_day,
                note: schedule.note,
            };
            return item;
        });
        buildingDetail = {
            id: id,
            location_group: location.name,
            name: 'TODO add name',
            address: building.address,
            pdf_guide: building.pdf_guide,
            description: 'TODO remove description and replace with map',
            image: building.image,
            syndicus: 'TODO add syndicus',
            schedules: scheduleItems,
            issues: issues.results,
        };
    }


    if (!buildingDetail) {
        return <p>Loading...</p>;
    }

    const issueCount = issues!.results.length;
    let issuesModalButtonText: string = '0 issues remaining';
    if (issues!.results.length > 0) {
        if (issues!.next) {
            issuesModalButtonText = `${issueCount}+ issues remaining`;
        } else {
            issuesModalButtonText = `${issueCount} issues remaining`;
        }
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
