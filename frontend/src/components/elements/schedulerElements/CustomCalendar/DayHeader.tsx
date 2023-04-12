import styles from './DayHeader.module.css';

type dayHeaderProps = {
    date: string,
}

const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DayHeader({date}: dayHeaderProps) {
    return (
        <div className={styles.full}>
            <p>{date.replaceAll('-', '/')}</p>
            <p>{weekday[new Date(date).getDay()]}</p>
        </div>
    );
}
