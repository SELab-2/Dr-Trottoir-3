import {Avatar} from '@mui/material';
import styles from './UserElement.module.css';
import {getUserDetail, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import {useEffect} from 'react';
import {User} from '@/api/models';

export default function UserElement() {
    const {data: session} = useSession();
    const [userData, setUserData] = useAuthenticatedApi<User>();

    useEffect(() => {
        getUserDetail(session, setUserData, 1);
    }, [session]);

    if (!userData) {
        return (<div>Loading...</div>);
    } else {
        if (userData.success) {
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
                                <p>Gent</p>
                                <p>Some random address</p>
                                <p>+32 000 00 00 00</p>
                            </div>
                            <div className={styles.firstColumnRow}>
                                <p className={styles.createdDate}>Account aangemaakt op 25-02-2023</p>
                            </div>
                        </div>
                        <div className={styles.picture}>
                            <Avatar
                                alt="Maxim"
                                src="/static/images/avatar/1.jpg"
                                sx={{width: 250, height: 250}}
                            />
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statsRow}>
                                <div className={styles.stat}>
                                    <h1>52</h1>
                                    <p>uur</p>
                                </div>
                                <div className={styles.stat}>
                                    <h1>13</h1>
                                    <p>routes</p>
                                </div>
                            </div>
                            <div className={styles.statsRow}>
                                <div className={styles.stat}>
                                    <h1>48</h1>
                                    <p>gebouwen</p>
                                </div>
                                <div className={styles.stat}>
                                    <h1>7</h1>
                                    <p>kilometers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.userContent}>
                        <div className={styles.userRoutes + ' ' + styles.userRoutesPadding}>
                            <h2 className={styles.routesTitle + ' ' + styles.extraTitlePadding}>Routes</h2>
                            <div className={styles.scrollList}>
                                <div className={styles.routesItems}>
                                    <h3 className={styles.routesSubtitle + ' ' + styles.extraTitlePadding}>Gepland</h3>

                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                </div>

                                <div className={styles.routesItems}>
                                    <h3 className={styles.routesSubtitle + ' ' + styles.extraTitlePadding}>Geschiedenis</h3>

                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                    <div className={styles.routesItem}>
                                        <h4>Route A</h4>
                                        <p>24-2-2023</p>
                                        <CloseIcon/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.userAnalytics}>
                            <div className={styles.graph}></div>
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
