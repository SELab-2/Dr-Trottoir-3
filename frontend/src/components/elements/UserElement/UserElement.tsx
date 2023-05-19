import {Avatar} from '@mui/material';
import styles from './userElement.module.css';
import {
    getLocationGroupDetail, getScheduleAssignmentsList,
    getScheduleDefinitionsList,
    getUserDetail,
    useAuthenticatedApi,
    getUserAnalytics,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import React, {useEffect, useState} from 'react';
import {LocationGroup, ScheduleAssignment, ScheduleDefinition, User, UserAnalytics} from '@/api/models';
import {Edit} from '@mui/icons-material';
import Button from '@mui/material/Button';
import EditUserPopup from '@/components/elements/UserElement/EditUserPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


type userElementProps = {
    id: number,
    onEdit: () => void,
}

type ChartData = {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: string
    }[]
}

export default function UserElement(props: userElementProps) {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    //
    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Uren gewerkt per maand',
            },
        },
    };

    const {data: session} = useSession();

    const [userData, setUserData] = useAuthenticatedApi<User>();
    const [scheduleDefinitions, setScheduleDefinitions] = useAuthenticatedApi<Array<ScheduleDefinition>>();
    const [scheduleAssignmentsData, setScheduleAssignmentsData] = useAuthenticatedApi<Array<ScheduleAssignment>>();
    const [locationGroupData, setLocationGroupData] = useAuthenticatedApi<LocationGroup>();
    const [userAnalytics, setUserAnalytics] = useAuthenticatedApi<UserAnalytics>();
    const [chartData, setChartData] = useState<ChartData>({labels: [], datasets: []});

    const [editPopupOpen, setEditPopupOpen] = useState<boolean>(false);
    function onOpenEditPopup() {
        setEditPopupOpen(true);
    }

    useEffect(() => {
        getUserDetail(session, setUserData, props.id);
    }, [session, props.id, editPopupOpen]);

    useEffect(() => {
        getUserAnalytics(session, setUserAnalytics, props.id);
    }, [session, props.id]);

    useEffect(() => {
        getScheduleDefinitionsList(session, setScheduleDefinitions);
    }, [session]);

    useEffect(() => {
        getScheduleAssignmentsList(session, setScheduleAssignmentsData, {user: props.id});
    }, [session, props.id]);

    useEffect(() => {
        if (userAnalytics !== undefined) {
            const labels = [];
            const data = [];

            for (const {date, seconds} of userAnalytics.data) {
                labels.push(date);
                data.push(Math.round(seconds / 3600));
            }

            const style = getComputedStyle(document.body);
            const yellow = style.getPropertyValue('--primary-yellow');

            setChartData({
                labels: labels,
                datasets: [{
                    label: '',
                    data: data,
                    backgroundColor: yellow,
                }],
            });
        }
    }, [userAnalytics]);

    useEffect(() => {
        if (userData && userData.data.student?.location_group) {
            getLocationGroupDetail(session, setLocationGroupData, userData.data.student.location_group);
        }
    }, [session, userData]);

    if (!userData || !scheduleDefinitions || !scheduleAssignmentsData ||
        (userData.data.student && !locationGroupData)
    ) {
        return (
            <LoadingElement/>
        );
    } else {
        if (userData.success && scheduleDefinitions.success && scheduleAssignmentsData.success &&
            (!userData.data.student || locationGroupData?.success)) {
            return (
                <div className={styles.userElement}>
                    <div className={styles.userHeader}>
                        <div className={styles.firstColumn}>
                            <div className={styles.firstColumnRow}>
                                <h1>{userData.data.first_name}</h1>
                                <h1>{userData.data.last_name}</h1>
                                <p>
                                    {
                                        userData.data.admin ? 'Admin' :
                                            userData.data.syndicus ? 'Syndicus' :
                                                userData.data.student && userData.data.student.is_super_student ?
                                                    'SuperStudent' : 'Student'
                                    }
                                </p>
                            </div>
                            <div className={styles.firstColumnRow}>
                                <p>{userData.data.student ? locationGroupData?.data.name : ''}</p>
                            </div>
                            <Button startIcon={<Edit/>} onClick={onOpenEditPopup}>
                                Gebruiker aanpassen
                            </Button>
                            <EditUserPopup
                                userId={userData.data.id}
                                onSubmit={props.onEdit}
                                open={editPopupOpen}
                                setOpen={setEditPopupOpen}
                                prevFirstName={userData.data.first_name}
                                prevLastName={userData.data.last_name}
                                prevStudent={userData.data.student}
                                prevSyndic={userData.data.syndicus}
                            />
                        </div>
                        <div className={styles.picture}>
                            <Avatar
                                alt="Avatar"
                                src="/static/images/avatar/1.jpg"
                                sx={{height: 128, width: 128}}
                            >{userData.data.first_name.at(0)}</Avatar>
                        </div>
                    </div>
                    <div className={styles.userContent}>
                        <div className={styles.userRoutes + ' ' + styles.userRoutesPadding}>
                            <h2 className={styles.routesTitle + ' ' + styles.extraTitlePadding}>Routes</h2>
                            <div className={styles.scrollList}>
                                <div className={styles.routesItems}>
                                    <h3 className={styles.routesSubtitle + ' ' + styles.extraTitlePadding}>Gepland</h3>
                                    {
                                        scheduleAssignmentsData?.data
                                            .filter((e) => {
                                                const dateParts = e.assigned_date.split('-');
                                                const dateObject = new Date(
                                                    +dateParts[2],
                                                    // @ts-ignore
                                                    dateParts[1] - 1,
                                                    +dateParts[0]
                                                );
                                                return dateObject <= new Date(Date.now());
                                            })
                                            .map((e) => {
                                                return (
                                                    <div className={styles.routesItem}>
                                                        <h4>
                                                            {
                                                                // @ts-ignore
                                                                scheduleDefinitions?.data.filter(
                                                                    // eslint-disable-next-line max-len
                                                                    (scheduleDefinition) => scheduleDefinition.id === e.schedule_definition
                                                                ).at(0).name
                                                            }
                                                        </h4>
                                                        <p>{e.assigned_date}</p>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>

                                <div className={styles.routesItems}>
                                    <h3 className={styles.routesSubtitle + ' ' + styles.extraTitlePadding}>
                                        Geschiedenis
                                    </h3>
                                    {
                                        scheduleAssignmentsData?.data
                                            .filter((e) => {
                                                const dateParts = e.assigned_date.split('-');
                                                // @ts-ignore
                                                const dateObject = new Date(
                                                    +dateParts[2],
                                                    // @ts-ignore
                                                    dateParts[1] - 1,
                                                    +dateParts[0]
                                                );
                                                return dateObject > new Date(Date.now());
                                            })
                                            .map((e) => {
                                                return (
                                                    <div className={styles.routesItem}>
                                                        <h4>
                                                            {
                                                                // @ts-ignore
                                                                // eslint-disable-next-line max-len
                                                                scheduleDefinitions?.data.filter((scheduleDefinition) => scheduleDefinition.id === e.schedule_definition).at(0).name
                                                            }
                                                        </h4>
                                                        <p>{e.assigned_date}</p>
                                                    </div>
                                                );
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.userAnalytics}>
                            <Bar data={chartData} options={options} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    {userData.status}
                </div>
            );
        }
    }
}
