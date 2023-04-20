import React from 'react';
import styles from './buttonComponent.module.css';
import {Avatar, Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';


const UserListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id === props.current;
    const userType = props.data.admin ?
        'admin' : (props.data.student ? (props.data.student.is_super_student ?
            'superstudent' : 'student') : 'syndicus');
    return (
        <Button id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
            className={styles.button_default}
            onClick={()=>props.onClick(props.data.id)}>
            <div className={styles.content_container}>
                <div className={styles.big_item_text}>
                    <p>{props.data.first_name + ' ' + props.data.last_name}</p>
                </div>
                <div className={styles.small_item_text}>
                    <p>{userType}</p>
                </div>
                <div className={styles.small_item_text}>
                    <p>{props.location}</p>
                </div>
            </div>
            <div className={styles.icon_container}>
                <Avatar src='public/media/img.png' alt="building" className={styles.image}/>
            </div>
        </Button>
    );
};


export default UserListButtonComponent;
