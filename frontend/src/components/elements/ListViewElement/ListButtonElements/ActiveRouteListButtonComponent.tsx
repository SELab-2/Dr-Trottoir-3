import React from 'react';
import styles from '@/components/elements/ListViewElement/ListButtonElements/ButtonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';
import CheckIcon from '@mui/icons-material/Check';

const ActiveRouteListButtonComponent = ({current, onClick, props}: ListItemProps) => {
    const isCurrent = props.id == current;
    return (

        <div className={styles.button_wrapper}>
            <Button id={(isCurrent)?styles.item_button_select : styles.item_button}
                className={styles.button_default}
                onClick={()=>onClick(props.id)}>
                <div className={styles.listItemTextWrapper}>
                    <div className={styles.listItemLeftSide}>
                        <div className={styles.big_item_text}>
                            {props.naam}
                        </div>
                        <div className={styles.small_item_text}>
                            {props.regio}
                        </div>
                        <div className={styles.small_item_text}>
                            {(Math.round(props.afstand/10))/100}km
                        </div>
                    </div>
                    <div className={styles.listItemRightSide}>
                        {conditionalCheckmark(props.voortgang === 1)}
                        <div className={styles.very_big_item_text}>
                            {Math.round(props.voortgang*100)}%
                        </div>
                    </div>
                </div>
            </Button>
        </div>
    );
};


const conditionalCheckmark = (checkmark: boolean) => {
    if (checkmark) {
        return (
            <CheckIcon></CheckIcon>
        );
    }
};


export default ActiveRouteListButtonComponent;
