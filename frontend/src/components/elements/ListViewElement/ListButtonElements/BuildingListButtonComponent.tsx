import React from 'react';
import styles from './buttonComponent.module.css';
import {Avatar, Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';


const BuildingListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id === props.current;

    return (
        <div>
            <Button id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
                className={styles.button_default}
                onClick={()=>props.onClick(props.data.id)}>
                <div className={styles.content_container}>
                    <div className={styles.big_item_text}>
                        <p>{props.data.name ? props.data.name : props.data.address}</p>
                    </div>
                    <div className={styles.small_item_text}>
                        <p>{props.data.address}</p>
                    </div>
                    <div className={styles.small_item_text}>
                        <p>{props.location}</p>
                    </div>
                </div>
                <div className={styles.icon_container}>
                    <Avatar src='public/media/img.png' alt="building" className={styles.image}/>
                </div>
            </Button>
        </div>
    );
};


export default BuildingListButtonComponent;
