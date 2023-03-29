import { Avatar } from '@mui/material';
import styles from './UserElement.module.css';

export default function UserElement() {
    return (
        <div className={styles.userElement}>
            <div className={styles.userHeader}>
                <div className={styles.firstColumn}>
                    <div className={styles.firstColumnRow}>
                        <h1>Firstname</h1>
                        <h1>Lastname</h1>
                        <p>Student</p>
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
                <div className={styles.userRoutes}>
                    <h2 className={styles.userRoutesPadding}>Routes</h2>
                </div>
                <div className={styles.userAnalytics}>
                    <div className={styles.graph}></div>
                </div>
            </div>
        </div>
    );
}
