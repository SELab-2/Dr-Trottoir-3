import {Avatar, IconButton, Tooltip} from '@mui/material';
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
import EditUserPopup from '@/components/elements/UserElement/EditUserPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import {Bar} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Legend,
} from 'chart.js';
import AssignmentList from '@/components/elements/UserElement/AssignmentList';


type userElementProps = {
    id: number,
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
                        <div className={styles.building_general_container}>
                            <div className={styles.building_title_container}>
                                <Tooltip
                                    title={userData.data.first_name + ' ' + userData.data.last_name} placement="top">
                                    <div style={{display: 'flex', flex: 1, flexFlow: 'column'}}>
                                        <h1 className={styles.building_data_title}>
                                            {userData.data.first_name}
                                        </h1>
                                        <h1 className={styles.building_data_title}>
                                            {userData.data.last_name}
                                        </h1>
                                    </div>
                                </Tooltip>
                                <div style={{margin: 'auto'}}>
                                    <IconButton onClick={onOpenEditPopup}>
                                        <Edit fontSize="small"/>
                                    </IconButton>
                                </div>
                            </div>
                            <div className={styles.building_data_container}>
                                <p>
                                    {
                                        userData.data.admin ? 'Admin' :
                                            userData.data.syndicus ? 'Syndicus' :
                                                userData.data.student && userData.data.student.is_super_student ?
                                                    'SuperStudent' : 'Student'
                                    }
                                </p>
                                <p>{userData.data.student ? locationGroupData?.data.name : ''}</p>
                            </div>
                            <EditUserPopup
                                userId={userData.data.id}
                                open={editPopupOpen}
                                setOpen={setEditPopupOpen}
                                prevFirstName={userData.data.first_name}
                                prevLastName={userData.data.last_name}
                                prevStudent={userData.data.student}
                                prevSyndic={userData.data.syndicus}
                            />
                        </div>
                        <div style={{display: 'flex', flex: 7}}/>
                        <div className={styles.picture}>
                            <Avatar
                                alt="Avatar"
                                src="/static/images/avatar/1.jpg"
                                sx={{height: 128, width: 128}}
                            >{userData.data.first_name.at(0)}</Avatar>
                        </div>
                    </div>


                    <div className={styles.userContent}>
                        <div className={styles.list_container}>
                            <AssignmentList title={'Gepland'} schedules={scheduleAssignmentsData?.data
                                .filter((e) => {
                                    const today = new Date();
                                    const date = new Date(e.assigned_date);
                                    return today <= date;
                                })} definitions={scheduleDefinitions.data}/>
                        </div>

                        <div className={styles.list_container}>
                            <AssignmentList title={'Geschiedenis'} schedules={scheduleAssignmentsData?.data
                                .filter((e) => {
                                    const today = new Date();
                                    const date = new Date(e.assigned_date);
                                    return today > date;
                                })} definitions={scheduleDefinitions.data}/>
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
