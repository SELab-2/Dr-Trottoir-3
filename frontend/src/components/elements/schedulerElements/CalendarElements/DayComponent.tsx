import styles from './DayComponent.module.css';
import Button from '@mui/material/Button';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import {ListChildComponentProps} from 'react-window';

export default function CalendarDay() {
    const date = '30/03/2023';
    const day = 'monday';

    return (
        <div className={styles.full_day}>

            <div className={styles.header}>
                {date}{day}
                <Button/>
            </div>
            <div className={styles.task_list}>
                <li>
                </li>
            </div>

        </div>
    );
}


// function renderRow(props: ListChildComponentProps) {
//     const {index, style} = props;
//
//     return (
//         <ListItem style={style} key={index} component="div" disablePadding>
//             <ListItemButton>
//                 <ListItemText primary={`Item ${index + 1}`} />
//             </ListItemButton>
//         </ListItem>
//     );
// }
