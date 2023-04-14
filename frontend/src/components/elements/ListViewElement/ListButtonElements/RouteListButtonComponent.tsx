import React from 'react';
import styles from './ButtonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';


const RouteListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id == props.current;

    console.log(props);

    return (
        <div>
            <Button id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
                className={styles.button_default}
                onClick={()=>props.onClick(props.data.id)}>
                <div className={styles.big_item_text}>
                    {props.data.name}
                </div>
                <div className={styles.small_item_text}>
                    {props.location}
                </div>
                <div className={styles.small_item_text}>
                    {props.data.buildings.length} gebouwen
                </div>
            </Button>
        </div>
    );
};


export default RouteListButtonComponent;
