import SchedulerSelect from '../components/elements/schedulerElements/SchedulerSelect';
import SchedulerDetails from '../components/elements/schedulerElements/SchedulerDetails';
import styles from './SchedulerPage.module.css';
import React, {useEffect, useState} from 'react';


export default function SchedulerPage() {
    const currentDay: Date = new Date();
    const [first, setFirst] = useState<number>(currentDay.getDate() - currentDay.getDay());
    const interval = 7;
    const [routes, setRoutes] = useState([]);
    const [users, setUsers] = useState(usersData);

    useEffect(() => {
        // load routes
        scheduleDefinitions.forEach((route) => {
            scheduleDefinitions['active'] = false;
        });
        setRoutes(scheduleDefinitions);
    }, [routes]);

    const nextWeek = () => {
        setFirst(first + interval);
    };

    const prevWeek = () => {
        setFirst(first - interval);
    };

    return (
        <div className={styles.full_calendar_flex_container}>
            <SchedulerSelect nextWeek={nextWeek} prevWeek={prevWeek}/>
            <SchedulerDetails start={first} routes={routes} setRoutes={setRoutes} users={users} interval={interval}/>
        </div>
    );
}


const scheduleDefinitions = [
    {
        'id': 1,
        'name': 'schedule definition 0',
        'version': 1,
        'location_group': 1,
        'buildings': [
            41,
            23,
            5,
            17,
            26,
        ],
    },
    {
        'id': 2,
        'name': 'schedule definition 1',
        'version': 1,
        'location_group': 2,
        'buildings': [
            47,
            6,
            28,
            36,
            28,
        ],
    },
    {
        'id': 3,
        'name': 'schedule definition 2',
        'version': 1,
        'location_group': 3,
        'buildings': [
            41,
            28,
            49,
            31,
            30,
        ],
    },
    {
        'id': 4,
        'name': 'schedule definition 3',
        'version': 1,
        'location_group': 1,
        'buildings': [
            23,
            30,
            20,
            29,
            15,
        ],
    },
    {
        'id': 5,
        'name': 'schedule definition 4',
        'version': 1,
        'location_group': 2,
        'buildings': [
            10,
            10,
            31,
            33,
            24,
        ],
    },
    {
        'id': 6,
        'name': 'schedule definition 5',
        'version': 1,
        'location_group': 3,
        'buildings': [
            5,
            38,
            44,
            47,
            43,
        ],
    },
    {
        'id': 7,
        'name': 'schedule definition 6',
        'version': 1,
        'location_group': 1,
        'buildings': [
            45,
            47,
            28,
            20,
            36,
        ],
    },
    {
        'id': 8,
        'name': 'schedule definition 7',
        'version': 1,
        'location_group': 2,
        'buildings': [
            14,
            41,
            43,
            45,
            30,
        ],
    },
    {
        'id': 9,
        'name': 'schedule definition 8',
        'version': 1,
        'location_group': 3,
        'buildings': [
            48,
            29,
            23,
            34,
            50,
        ],
    },
    {
        'id': 10,
        'name': 'schedule definition 9',
        'version': 1,
        'location_group': 1,
        'buildings': [
            46,
            40,
            5,
            31,
            25,
        ],
    },
];

const usersData = [
    {
        'id': 1,
        'first_name': 'Admin',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': {
            'id': 1,
            'user': 1,
        },
        'syndicus': null,
    },
    {
        'id': 2,
        'first_name': 'SuperStudent',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 1,
            'is_super_student': true,
            'user': 2,
            'location_group': 1,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 3,
        'first_name': 'Student',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 2,
            'is_super_student': false,
            'user': 3,
            'location_group': 1,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 4,
        'first_name': 'Syndicus',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 1,
            'user': 4,
            'buildings': [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
            ],
        },
    },
    {
        'id': 5,
        'first_name': 'Student0',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 3,
            'is_super_student': false,
            'user': 5,
            'location_group': 1,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 6,
        'first_name': 'Student1',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 4,
            'is_super_student': false,
            'user': 6,
            'location_group': 2,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 7,
        'first_name': 'Student2',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 5,
            'is_super_student': false,
            'user': 7,
            'location_group': 3,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 8,
        'first_name': 'Student3',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 6,
            'is_super_student': false,
            'user': 8,
            'location_group': 1,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 9,
        'first_name': 'Student4',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 7,
            'is_super_student': false,
            'user': 9,
            'location_group': 2,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 10,
        'first_name': 'Student5',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 8,
            'is_super_student': false,
            'user': 10,
            'location_group': 3,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 11,
        'first_name': 'Student6',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 9,
            'is_super_student': false,
            'user': 11,
            'location_group': 1,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 12,
        'first_name': 'Student7',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 10,
            'is_super_student': false,
            'user': 12,
            'location_group': 2,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 13,
        'first_name': 'Student8',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 11,
            'is_super_student': false,
            'user': 13,
            'location_group': 3,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 14,
        'first_name': 'Student9',
        'last_name': 'DrTrottoir',
        'student': {
            'id': 12,
            'is_super_student': false,
            'user': 14,
            'location_group': 1,
        },
        'admin': null,
        'syndicus': null,
    },
    {
        'id': 15,
        'first_name': 'Syndicus0',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 2,
            'user': 15,
            'buildings': [
                13,
                22,
                26,
                38,
                43,
            ],
        },
    },
    {
        'id': 16,
        'first_name': 'Syndicus1',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 3,
            'user': 16,
            'buildings': [
                16,
                21,
                24,
                30,
                40,
            ],
        },
    },
    {
        'id': 17,
        'first_name': 'Syndicus2',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 4,
            'user': 17,
            'buildings': [
                15,
                26,
                31,
                38,
                46,
            ],
        },
    },
    {
        'id': 18,
        'first_name': 'Syndicus3',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 5,
            'user': 18,
            'buildings': [
                13,
                41,
                46,
                50,
            ],
        },
    },
    {
        'id': 19,
        'first_name': 'Syndicus4',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 6,
            'user': 19,
            'buildings': [
                16,
                24,
                35,
                37,
                45,
            ],
        },
    },
    {
        'id': 20,
        'first_name': 'Syndicus5',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 7,
            'user': 20,
            'buildings': [
                6,
                22,
                31,
                46,
                49,
            ],
        },
    },
    {
        'id': 21,
        'first_name': 'Syndicus6',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 8,
            'user': 21,
            'buildings': [
                14,
                24,
                28,
                41,
                44,
            ],
        },
    },
    {
        'id': 22,
        'first_name': 'Syndicus7',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 9,
            'user': 22,
            'buildings': [
                1,
                20,
                34,
                36,
                42,
            ],
        },
    },
    {
        'id': 23,
        'first_name': 'Syndicus8',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 10,
            'user': 23,
            'buildings': [
                1,
                13,
                17,
                25,
                44,
            ],
        },
    },
    {
        'id': 24,
        'first_name': 'Syndicus9',
        'last_name': 'DrTrottoir',
        'student': null,
        'admin': null,
        'syndicus': {
            'id': 11,
            'user': 24,
            'buildings': [
                10,
                12,
                29,
                44,
                49,
            ],
        },
    },
];
