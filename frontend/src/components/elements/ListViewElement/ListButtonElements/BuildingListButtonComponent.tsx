import React from 'react';
import styles from '@/components/elements/ListViewElement/ListButtonElements/ButtonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';

const BuildingListButtonComponent = ({current, onClick, props}: ListItemProps) => {
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
                    {props.adres}
                </div>
                <div className={styles.small_item_text}>
                    {props.regio}
                </div>
            </Button>
        </div>
    );
};


export default BuildingListButtonComponent;
