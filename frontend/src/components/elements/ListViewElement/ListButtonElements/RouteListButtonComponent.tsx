import React, {useEffect} from 'react';
import styles from './buttonComponent.module.css';
import {Button} from '@mui/material';
import {ListItemProps} from './ListButtonComponentInterface';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import SensorsOffRoundedIcon from '@mui/icons-material/SensorsOffRounded';
import {useSession} from "next-auth/react";
import {getScheduleAssignmentsList, useAuthenticatedApi} from "@/api/api";
import {ScheduleAssignment} from "@/api/models";

const RouteListButtonComponent = (props: ListItemProps) => {
    const isCurrent = props.data.id === props.current;
    const {data: session} = useSession();
    const [route, setRoute] = useAuthenticatedApi<ScheduleAssignment[]>();

    useEffect(() => {

        const firstDay = new Date();
        firstDay.setHours(firstDay.getHours() + 2);

        getScheduleAssignmentsList(
            session,
            setRoute,
            {
                schedule_definition: props.data.id,
                assigned_date__gt: firstDay.toISOString().split('T')[0]
            });
    }, [session])

    if(route) {
        return (
            <div>
                <Button id={(isCurrent) ? styles['item_button_select'] : styles['item_button']}
                        className={styles.button_default}
                        onClick={() => props.onClick(props.data.id)}>
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
                            route.data.filter(e => e.assigned_date).length ?
                                <SensorsRoundedIcon style={{color: 'var(--primary-yellow)'}}/> :
                                <SensorsOffRoundedIcon/>
                        }
                    </div>
                </Button>
            </div>
        );
    } else {
        return (<></>);
    }
};


export default RouteListButtonComponent;
