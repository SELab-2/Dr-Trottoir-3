import styles from './studentTaskList.module.css';
import {Button, Card} from '@mui/material';
import React, {useEffect} from 'react';
import CheckIcon from '@mui/icons-material/Check';
import {PlayArrow} from '@mui/icons-material';
import {useSession} from 'next-auth/react';
import {
    getScheduleAssignmentsList, getScheduleDefinitionsAssignedToMeList,
    getScheduleWorkEntriesList,
    useAuthenticatedApi,
} from '@/api/api';
import {ScheduleAssignment, ScheduleDefinition, ScheduleWorkEntry} from '@/api/models';
import Link from 'next/link';


type StudentTaskListProps = {
    userId: number,
}

type RoutesByDay = {
    date: string,
    assignments: ScheduleAssignment[],
    definitions: ScheduleDefinition[],
    workEntries: ScheduleWorkEntry[],
}


type DisplayRoute = {
    name: string,
    totalBuildings: number,
    buildingsDone: number,
    today: boolean,
}

export default function StudentTaskList({userId}: StudentTaskListProps) {
    const {data: session} = useSession();
    const [assignments, setAssignments] = useAuthenticatedApi<ScheduleAssignment[]>();
    const [workEntries, setWorkEntries] = useAuthenticatedApi<ScheduleWorkEntry[]>();
    const [definitions, setDefinitions] = useAuthenticatedApi<ScheduleDefinition[]>();

    useEffect(() => {
        getScheduleAssignmentsList(session, setAssignments, {user: userId});
        // TODO: mockdata currently only has AR but would make more sense to be DE
        getScheduleWorkEntriesList(session, setWorkEntries, {entry_type: 'AR', schedule_assignment__user: userId});
        getScheduleDefinitionsAssignedToMeList(session, setDefinitions);
    }, [session]);

    if (assignments && workEntries && definitions) {
        const assignmentsByDate = assignments.data.reduce<Record<string, ScheduleAssignment[]>>((prev, curr) => {
            const key = curr.assigned_date;
            const group = prev[key] || [];
            group.push(curr);
            return {...prev, [key]: group};
        }, {});
        const filteredAssignments = Object.entries(assignmentsByDate).slice(0).filter(
            ([date, assignments])=>date>=new Date().toISOString().split('T')[0]).sort();
        return (
            <div className={styles.outerDiv}>
                <h1 className={styles.title}>Toegekende Routes</h1>
                <div className={styles.scroll}>
                    {
                        filteredAssignments.slice(0).map(([date, assignments]) => (
                            <Day date={date} key={date} assignments={assignments} definitions={definitions.data}
                                 workEntries={workEntries.data}/>
                        ))
                    }
                </div>
            </div>
        );
    } else {
        return (
            <div>Loading...</div>
        );
    }
}


const Day = ({date, assignments, definitions, workEntries}: RoutesByDay) => {
    const mappedAssignments = assignments.map((assignment) => {
        const definition = definitions.filter((def) => def.id === assignment.schedule_definition)[0];
        const entries = workEntries.filter((entry) => entry.schedule_assignment === assignment.id);
        // Because a buildings can accept multiple schedule work entries of the same type, we need to remove duplicates
        const buildingsWithEntries = new Set(entries.map((entry) => entry.building));
        return {
            id: assignment.id,
            name: definition.name,
            totalBuildings: definition.buildings.length,
            buildingsDone: buildingsWithEntries.size,
        };
    });
    return (
        <div className={styles.dayDiv}>
            {dateOrToday(date)}
            {
                mappedAssignments.map((x) =>
                    <Link href={`/active-route/${x.id}`} key={x.id}>
                        <RouteEntry
                            name={x.name}
                            totalBuildings={x.totalBuildings}
                            buildingsDone={x.buildingsDone}
                            today={isToday(date)}
                        />
                    </Link>
                )
            }
        </div>
    );
};

const RouteEntry = ({name, totalBuildings, buildingsDone, today}: DisplayRoute) => {
    return (
        <div className={styles.button_wrapper}>
            <Button className={styles.button_default} >
                <Card sx={{
                    width: '100%', height: 'auto', minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--secondary-light)',
                    boxShadow: 'none',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                }}>
                    <div className={styles.listItemLeftSide}>
                        <b>{name}</b>
                    </div>
                    <div className={styles.listItemRightSide}>
                        <div>
                            {buildingsDone}/{totalBuildings}
                        </div>
                        <div className={styles.checkmark}>
                            {conditionalCheckmark(buildingsDone === totalBuildings, today)}
                        </div>

                    </div>
                </Card>
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
        );
    } else {
        return (
            <></>
        );
    }
};

const dateOrToday = (date: string) => {
    if (isToday(date)) {
        return (
            <p className={styles.dateText}>vandaag</p>
        );
    } else {
        return (
            <p className={styles.dateText}>
                {date}
            </p>
        );
    }
};

function isToday(date: string) {
    return date == new Date().toISOString().split('T')[0];
}

