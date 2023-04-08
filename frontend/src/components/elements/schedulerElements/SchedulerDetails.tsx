import Scheduler from './CalendarElements/Scheduler';

import styles from './SchedulerDetails.module.css';
import React from 'react';


const dummyUsers = [
    {'id': 7, 'voornaam': 'Bavo', 'achternaam': 'Verstraeten', 'uren gewerkt': 15, 'type': 'student', 'regio': 'Gent'},
    {'id': 2, 'voornaam': 'Jef', 'achternaam': 'Roosens', 'uren gewerkt': 6, 'type': 'admin', 'regio': 'Gent'},
    {'id': 3, 'voornaam': 'Maxim', 'achternaam': 'Stockmans', 'uren gewerkt': 45, 'type': 'syndicus', 'regio': 'Gent'},
    {'id': 5, 'voornaam': 'Joris', 'achternaam': 'Peeters', 'uren gewerkt': 6, 'type': 'student', 'regio': 'Gent'},
    {'id': 6, 'voornaam': 'Jahid', 'achternaam': 'Chetti', 'uren gewerkt': 15, 'type': 'student', 'regio': 'Gent'},
    {'id': 8, 'voornaam': 'persoon 3', 'achternaam': 'Bar', 'uren gewerkt': 3, 'type': 'syndicus', 'regio': 'Gent'},
    {'id': 9, 'voornaam': 'persoon 1', 'achternaam': 'Baz', 'uren gewerkt': 1, 'type': 'superstudent', 'regio': 'Gent'},
    {'id': 11, 'voornaam': 'Joe', 'achternaam': 'Biden', 'uren gewerkt': 1, 'type': 'superstudent', 'regio': 'Gent'},
];

const dummyRoutes = [
    {id: 7, naam: 'Bavo', regio: 'Gent', afstand: 10000},
    {id: 2, naam: 'Jef', regio: 'Gent', afstand: 8000},
    {id: 3, naam: 'Maxim', regio: 'Gent', afstand: 6900},
    {id: 5, naam: 'Joris', regio: 'Gent', afstand: 25000},
    {id: 6, naam: 'Jahid', regio: 'Gent', afstand: 13000},
    {id: 8, naam: 'route 3', regio: 'Gent', afstand: 42000},
    {id: 9, naam: 'route 1', regio: 'Gent', afstand: 23000},
    {id: 11, naam: 'zuid', regio: 'Gent', afstand: 7000},
];


export default function SchedulerDetails(props: any) {
    const currentDay: Date = new Date();
    const first: number = currentDay.getDate() - currentDay.getDay();

    return (
        <div className={styles.calendar_component}>
            <Scheduler users={dummyUsers} routes={dummyRoutes} start={first} days={7}/>
        </div>
    );
}
