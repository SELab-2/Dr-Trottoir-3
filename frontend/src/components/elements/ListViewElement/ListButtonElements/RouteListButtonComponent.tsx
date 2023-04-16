import React from 'react';
import styles from './buttonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';


const RouteListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id == props.current;
    console.log(props.data);
    return (
        <div>
            <Button id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
                className={styles.button_default}
                onClick={()=>props.onClick(props.data.id)}>
                <div className={styles.content_container}>
                    <div className={styles.big_item_text}>
                        <p>{props.data.name}</p>
                    </div>
                    <div className={styles.small_item_text}>
                        <p>{props.location}</p>
                    </div>
                    <div className={styles.small_item_text}>
                        <p>{props.data.buildings.length} km</p>
                    </div>
                </div>
                <div className={styles.state_container}>
                    {
                        props.data.active ?
                            <SensorsRoundedIcon style={{color: 'var(--primary-yellow)'}}/> :
                            <SensorsRoundedIcon/>
                    }
                </div>
            </Button>
        </div>
    );
};


export default RouteListButtonComponent;
