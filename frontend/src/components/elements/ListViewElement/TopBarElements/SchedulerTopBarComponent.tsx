import styles from './topBar.module.css';
import listStyles from '../../ListViewElement/listView.module.css';
import React from 'react';
import Button from '@mui/material/Button';
import {MenuItem, Select, SelectChangeEvent} from '@mui/material';
import {LocationGroup} from '@/api/models';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

type schedulerSelectProps = {
    nextWeek: any,
    prevWeek: any,
    selectedRegion: LocationGroup,
    setSelectedRegion: (e: LocationGroup) => void,
    allRegions: LocationGroup[]
}

export default function SchedulerTopBarComponent(props: schedulerSelectProps) {
    const handleChangeRegion = (event: SelectChangeEvent<number>) => {
        const value = props.allRegions.at(Number(event.target.value)) as LocationGroup;
        props.setSelectedRegion(value);
    };

    return (
        <div className={styles.topBar}>
            <div className={listStyles.side_bar_top}>
                <div className={listStyles.title}>
                    {/* <props.Icon className={styles.icon}/>*/}
                    <p className={listStyles.title}>Planner</p>
                </div>
            </div>

            <div className={styles.filters_container}>
                <Button className={styles.filter_button}>
                    <Select
                        className={styles.hide_select}
                        sx={{
                            'padding': '0',
                            'boxShadow': '0',
                            '.MuiOutlinedInput-notchedOutline': {border: 0},
                            '.Mui-focused-notchedOutline': {border: 0},
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 0,
                            },
                        }}
                        inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-light)',
                                    },
                                },
                            },
                        }}
                        IconComponent={() => null}
                        value={props.allRegions.indexOf(props.selectedRegion)}
                        onChange={handleChangeRegion}
                        label="Sorteer op"
                        renderValue={() =>
                            <p className={styles.collapse_text} style={{width: '40px'}}>
                                {props.selectedRegion.name}
                            </p>}
                    >
                        {Object.entries(props.allRegions).map(([option, value]) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                {value.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FilterAltIcon/>
                </Button>
            </div>
            <Button className={styles.button_small} onClick={() => (props.prevWeek())}>
                vorige
            </Button>
            <Button className={styles.button_small} onClick={() => (props.nextWeek())}>
                volgende
            </Button>
        </div>
    );
}
