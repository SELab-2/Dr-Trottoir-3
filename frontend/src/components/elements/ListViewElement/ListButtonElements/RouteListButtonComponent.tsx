import React from 'react';
import styles from '@/components/elements/ListViewElement/ListButtonElements/ButtonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';


const RouteListButtonComponent = ({current, onClick, props}: ListItemProps) => {
    const isCurrent = props.id == current;
    return (
        <div className={styles.button_wrapper}>
            <Button id={(isCurrent)?styles.item_button_select : styles.item_button}
                className={styles.button_default}
                onClick={()=>onClick(props.id)}>
                <div className={styles.big_item_text}>
                    {props.naam}
                </div>
                <div className={styles.small_item_text}>
                    {props.regio}
                </div>
                <div className={styles.small_item_text}>
                    {(Math.round(props.afstand/10))/100}km
                </div>
            </Button>
        </div>
    );
};


export default RouteListButtonComponent;
