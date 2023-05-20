import {Building, GarbageCollectionSchedule, GarbageType, PublicBuilding,} from '@/api/models';
import {
    getBuildingDetail,
} from '@/api/api';
import React, {useEffect, useState} from 'react';
import {Box, Link, Tooltip} from '@mui/material';
import styles from './PublicBuildingPage.module.css';
import {defaultBuildingImage} from '@/constants/images';
import BuildingMap from '@/components/elements/BuildingDetailElement/BuildingMap';
import PublicGarbageCollectionScheduleList from "./PublicGarbageCollectionScheduleList";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";
import {PictureAsPdf} from "@mui/icons-material";

export default function PublicBuildingPage(props: { id: number }) {
    const {id} = props;

    const [buildingData, setBuildingData] = useState<Object>();

    useEffect(()=>{
        if (id !== null) {
            getBuildingDetail(null, setBuildingData, id);
        }
    }, [id]);

    const [building, setBuilding] = useState<Building | undefined>(undefined);
    const [garbageTypes, setGarbageTypes] = useState<Array<GarbageType> | undefined>(undefined);
    const [garbageCollectionSchedules, setGarbageCollectionSchedules] = useState<Array<GarbageCollectionSchedule> | undefined>(undefined);


    useEffect(()=>{
        // @ts-ignore
        if(buildingData && buildingData.status == 200){
            // @ts-ignore
            setBuilding(buildingData.data.building);
            // @ts-ignore
            setGarbageTypes(buildingData.data.garbage_types);
            // @ts-ignore
            setGarbageCollectionSchedules(buildingData.data.schedules);
        }
    }, [buildingData]);

    function isTodayOrFuture(dateString: string) {
        // Create date object from date string
        const inputDate = new Date(dateString);
        inputDate.setHours(0, 0, 0, 0);  // Reset time to ensure comparison by date only

        // Get today's date
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Reset time to ensure comparison by date only

        // Check if input date is today or in the future
        return inputDate >= today;
    }

    if (building && garbageTypes && garbageCollectionSchedules) {
        return (
            <div className={styles.fullWrapper}>
            <div className={styles.full}>
                {/* Top row */}
                <div className={styles.top_row_container}>
                    {/* Building data container */}
                    <div className={styles.building_general_container}>
                        <div className={styles.building_title_container}>
                            <Tooltip title={building.name} placement="top">
                                <h1 className={styles.building_data_title}>
                                    {building.name}
                                </h1>
                            </Tooltip>
                            <div style={{margin: 'auto'}}>
                            </div>
                        </div>
                        <div className={styles.building_data_container}>
                            <Tooltip title={building.location_group} placement="right">
                                <p>{building.location_group}</p>
                            </Tooltip>
                            <Tooltip title={building.address} placement="right">
                                <p>{building.address}</p>
                            </Tooltip>
                            <Tooltip title={building.syndici} placement="right">
                                <p>{building.syndici}</p>
                            </Tooltip>
                            {/* Button to open the issue modal*/}
                        </div>
                        <div className={styles.building_issues_container}>
                            <BuildingDetailManualLink path={building.pdf_guide}/>
                            <div style={{flex: '1'}}></div>
                        </div>
                    </div>

                    {/* Building description container */}
                    <div className={styles.building_desc_container}>
                        <BuildingMap longitude={building.longitude} latitude={building.latitude}/>
                    </div>

                    {/* Building image container */}
                    <div className={styles.building_imag_container}>
                        <img src={
                            building.image ?
                                building.image :
                                defaultBuildingImage
                        }
                             alt={'Building'}/>
                    </div>
                </div>

                {/* Bottom row */}
                <div className={styles.bottom_row_container}>
                    {/* Planning */}
                    <Box flexGrow={3} flexBasis={0}>
                        <PublicGarbageCollectionScheduleList garbageTypes={garbageTypes} garbageCollectionSchedules={garbageCollectionSchedules.filter(e => isTodayOrFuture(e.for_day))}/>
                    </Box>
                </div>
            </div>
            </div>
        );
    } else {
        return (
            <LoadingElement />
        );
    }
}


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
