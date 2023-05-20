import React, {useEffect} from 'react';
import styles from './buttonComponent.module.css';
import {Avatar, Badge, Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';
import {getBuildingDetailIssues, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Issue} from '@/api/models';


const BuildingListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id === props.current;

    const {data: session} = useSession();
    const [issues, setIssues] = useAuthenticatedApi<Issue[]>();

    // Get issues
    useEffect(() => {
        getBuildingDetailIssues(session, setIssues, props.data.id);
    }, [props.data.id, session]);

    return (
        <div className={styles.full}>
            <Button fullWidth={true} id={(isCurrent)?styles['item_button_select'] : styles['item_button']}
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
                    <Badge
                        sx={{
                            '& .MuiBadge-badge': {
                                color: 'var(--primary-dark)',
                                backgroundColor: 'var(--primary-yellow)',
                            },
                            '.MuiBadge-root': {
                                width: '100%',
                            },
                        }}
                        badgeContent={issues ? issues.data.length : 0}
                        overlap="circular"
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <Avatar src={props.data.image ? props.data.image : 'public/media/img.png'} alt={props.data.name}
                            className={styles.image}/>
                    </Badge>
                </div>
            </Button>
        </div>
    );
};


export default BuildingListButtonComponent;
