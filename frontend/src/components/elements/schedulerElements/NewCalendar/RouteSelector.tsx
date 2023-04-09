import React from 'react';
import {Checkbox, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
// import styles from './RouteSelector.module.css';

type props = {
    showScheduleDefinitions: any,
    setShowScheduleDefinitions: any,
    setScheduleDefenitionsSelector: any,
}

export default function RouteSelector({showScheduleDefinitions, setShowScheduleDefinitions, setScheduleDefenitionsSelector}:props) {
    // const handleClose = () => {
    //     setScheduleDefenitionsSelector(false);
    // };

    console.log(showScheduleDefinitions);

    const handleToggle = (value: any) => {
        // const newShowScheduleDefinitions = {...showScheduleDefinitions};
        // newShowScheduleDefinitions[value] = !newShowScheduleDefinitions[value];
        // setShowScheduleDefenitions(newShowScheduleDefinitions);
    };

    return (
        <List sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
            {showScheduleDefinitions.map((route) => {
                return (
                    <ListItem key={route}>
                        <ListItemButton onClick={handleToggle(route)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={null}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText id={route} primary={route.name}/>
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
}
