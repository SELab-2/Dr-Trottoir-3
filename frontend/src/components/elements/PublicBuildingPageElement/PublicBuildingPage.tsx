import {PublicBuilding} from '@/api/models';
import {getBuildingDetail} from '@/api/api';
import {useEffect, useState} from 'react';
import {Box, Link, List, Modal, Typography} from '@mui/material';
import styles from '../BuildingDetailElement/buildingDetail.module.css';
import {defaultBuildingImage} from '@/constants/images';
import BuildingMap from '@/components/elements/BuildingDetailElement/BuildingMap';

export default function PublicBuildingPage(props: { id: number }) {
    const {id} = props;

    const [building, setBuilding] = useState<PublicBuilding | undefined>(undefined);

    useEffect(()=>{
        if (id !== null) {
            getBuildingDetail(null, setBuilding, id);
        }
    }, [id]);

    return building ? (
        <Box className={styles.full}>
            {/* Top row */}
            <Box className={styles.top_row_container}
                sx={{background: 'var(--secondary-light)'}}>
                {/* Building data container */}
                <Box className={styles.building_data_container}>
                    <h1>
                        {building.data.name}
                    </h1>
                    <br/>
                    <Box className={styles.building_data_container_data}>
                        <Typography className={styles.building_data_data}>
                            {building.data.address}
                        </Typography>
                    </Box>
                </Box>
                <Box className={styles.building_desc_container}>
                    <BuildingMap longitude={building.data.longitude} latitude={building.data.latitude}/>
                </Box>
                <Box className={styles.building_imag_container}>
                    <img src={
                        building.data.image ?
                            building.data.image :
                            defaultBuildingImage
                    }
                    alt={'Building'}/>
                </Box>
            </Box>
        </Box>

    ) : (
        <p>nope</p>
    );
}
