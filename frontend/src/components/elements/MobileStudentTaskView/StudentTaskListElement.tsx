import styles from './StudentTaskListElement.module.css';
import {Button, Link} from '@mui/material';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import {PlayArrow} from '@mui/icons-material';

export default function StudentTaskList() {
    return (
        <div className={styles.outerDiv}>
            <h1 className={styles.title}>Toegekende Routes</h1>
            <div>

                {
                    dummyDays.map((x) => <Day date={x.date} routes={x.routes}/>)
                }
            </div>

        </div>
    );
}

type Route = {
    name: string,
    totalBuildings: number,
    buildingsDone: number,
};

type RoutesForDay = {
    date: Date,
    routes: [Route],
}

type RouteForDisplay = {
    name: string,
    totalBuildings: number,
    buildingsDone: number,
    isToday: boolean,
}

const Day = ({date, routes}: RoutesForDay) => {
    return (
        <div className={styles.dayDiv}>
            {dateOrToday(date)}

            {
                routes.map((x) => <RouteEntry name={x.name} totalBuildings={x.totalBuildings}
                    buildingsDone={x.buildingsDone} isToday={isToday(date)}/>)
            }
        </div>
    );
};

const RouteEntry = ({name, totalBuildings, buildingsDone, isToday}: RouteForDisplay) => {
    return (
        <div className={styles.button_wrapper}>
            <Button className={styles.button_default} >
                <div className={styles.listItemLeftSide}>
                    <div className={styles.big_item_text}>
                        <Link flexGrow={5} noWrap href={'/building/${id}'} color={'inherit'}
                            underline={'none'}>{name}</Link>
                    </div>
                </div>
                <div className={styles.listItemRightSide}>
                    <div>
                        {buildingsDone}/{totalBuildings}
                    </div>
                    <div className={styles.checkmark}>
                        {conditionalCheckmark(buildingsDone === totalBuildings, isToday)}
                    </div>

                </div>
            </Button>
        </div>
    );
};

const conditionalCheckmark = (checkmark: boolean, isToday: boolean) => {
    if (checkmark) {
        return (
            <CheckIcon></CheckIcon>
        );
    } else if (isToday) {
        return (
            <PlayArrow></PlayArrow>
            // <div></div>
        );
    } else {
        return (
            <p></p>
        );
    }
};

const dateOrToday = (date: Date) => {
    if (isToday(date)) {
        return (
            <p className={styles.dateText}>vandaag</p>
        );
    } else {
        return (
            <p className={styles.dateText}>
                {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
            </p>
        );
    }
};

function isToday(date: Date) {
    return date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() &&
        date.getFullYear() == new Date().getFullYear();
}

const dummyRoutes:Route[] = [
    {name: 'aardappel', totalBuildings: 5, buildingsDone: 3},
    {name: 'peer', totalBuildings: 5, buildingsDone: 2},
    {name: 'salade', totalBuildings: 5, buildingsDone: 5},
    {name: 'water', totalBuildings: 5, buildingsDone: 0},
    {name: 'very very very long route name very big long name', totalBuildings: 5, buildingsDone: 0},
    {name: 'LOOONGLOOOOOOOOOOOOOOOOOOOOOOOONGNAAAAAMMMMMMMEEEE', totalBuildings: 7, buildingsDone: 7},
];

const dummyDays:RoutesForDay[] = [
    {date: new Date(), routes: dummyRoutes},
    {date: new Date('April 07, 2023'), routes: dummyRoutes},
    {date: new Date('April 06, 2023'), routes: dummyRoutes},
    {date: new Date('April 05, 2023'), routes: dummyRoutes},
];
