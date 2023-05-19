import {Building, PublicBuilding,} from '@/api/models';
import {
    getBuildingDetail,
} from '@/api/api';
import React, {useEffect, useState} from 'react';
import {Box, Link, Tooltip} from '@mui/material';
import styles from '../BuildingDetailElement/buildingDetail.module.css';
import {defaultBuildingImage} from '@/constants/images';
import BuildingMap from '@/components/elements/BuildingDetailElement/BuildingMap';
import GarbageCollectionScheduleList from "./GarbageCollectionScheduleList";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";
import {PictureAsPdf} from "@mui/icons-material";

export default function PublicBuildingPage(props: { id: number }) {
    const {id} = props;

    const [building, setBuilding] = useState<Building>();

    useEffect(()=>{
        if (id !== null) {
            getBuildingDetail(null, setBuilding, id);
        }
    }, [id]);




    if (building) {
        return (
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
                        <GarbageCollectionScheduleList buildingId={id}/>
                    </Box>
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
