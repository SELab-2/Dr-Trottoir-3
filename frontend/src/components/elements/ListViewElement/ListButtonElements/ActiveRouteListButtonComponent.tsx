import React from 'react';
import styles from '@/components/elements/ListViewElement/ListButtonElements/buttonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';
import CheckIcon from '@mui/icons-material/Check';

const ActiveRouteListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id === props.current;
    const progress = props.data.buildingsDone/props.data.totalBuildings;

    return (

        <div className={styles.button_wrapper}>
            <Button id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
                className={styles.button_default}
                onClick={()=>props.onClick(props.data.id)}>
                <div className={styles.listItemTextWrapper}>
                    <div className={styles.listItemLeftSide}>
                        <div className={styles.big_item_text}>
                            {props.data.name}
                        </div>
                        <div className={styles.small_item_text}>
                            {props.location}
                        </div>
                        <div className={styles.small_item_text}>
                            {props.data.student}
                        </div>
                    </div>
                    <div className={styles.listItemRightSide}>
                        {conditionalCheckmark(progress === 1)}
                        <div className={styles.very_big_item_text}>
                            {Math.round(progress*100)}%
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
