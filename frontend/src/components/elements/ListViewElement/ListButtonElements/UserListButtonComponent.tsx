import React from 'react';
import styles from './buttonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';


const UserListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id == props.current;
    const userType = props.data.admin ?
        'admin' : (props.data.student ? (props.data.student.is_super_student ?
            'superstudent' : 'student') : 'syndicus');
    return (
        <Button key={props.data.id} id={(isCurrent)?styles.item_button_select : styles.item_button}
            className={styles.button_default}
            onClick={()=>props.onClick(props.data.id)}>
            <div className={styles.big_item_text}>
                {props.data.first_name + ' ' + props.data.last_name}
            </div>
            <div className={styles.small_item_text}>
                {userType}
            </div>
            <div className={styles.small_item_text}>
                {props.location}
            </div>
        </Button>
    );
};


export default UserListButtonComponent;
