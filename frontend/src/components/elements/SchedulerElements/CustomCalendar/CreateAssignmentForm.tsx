import React, {SyntheticEvent, useEffect, useState} from 'react';
import styles from '@/styles/listView.module.css';
import {
    Autocomplete,
    Button,
    FormControl,
    Stack,
    TextField,
} from '@mui/material';
import {ScheduleDefinition, User} from '@/api/models';
import {ApiData} from '@/api/api';
import {DemoItem} from '@mui/x-date-pickers/internals/demo';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';


type createAssignmentFormProps = {
    setOpen: (e:any) => void,
    allUsers: ApiData<User[]>,
    allRoutes: ApiData<ScheduleDefinition[]>,
    initialInfo: any,
    onCreateClick: any,
    start: number,
}

export default function CreateAssignmentForm(props: createAssignmentFormProps) {
    const [formScheduleDefinition, setFormScheduleDefinition] = useState<string>('');
    const [formUser, setFormUser] = useState<string>('');
    const [formDate, setFormDate] = useState<string>('');

    useEffect(() => {
        if (props.initialInfo) {
            const route = props.allRoutes.data.filter(
                (e) => e.id == props.initialInfo.schedulerDefinitionIndex
            )[0];

            setFormScheduleDefinition(route.name.toString());

            const day = new Date();
            day.setDate(props.initialInfo.schedulerAssignmentIndex + props.start);
            day.setHours(day.getHours() + 2);
            setFormDate(
                day.toISOString().split('T')[0]
            );
        }
    }, [props.initialInfo]);

    const handleClose = () => {
        props.setOpen(undefined);
    };

    const handleSubmitForm = () =>{
        const scheduleDefinition = props.allRoutes.data.filter((e) => e.name == formScheduleDefinition);
        const user = props.allUsers.data.filter((e) => e.first_name + ' ' + e.last_name == formUser);
        const day = new Date(formDate);

        if (user.length > 0 && scheduleDefinition.length > 0) {
            props.onCreateClick(scheduleDefinition[0].id, day.toISOString().split('T')[0], user[0].id);
            handleClose();
        }
    };

    const handleChangeFormDate = (date: any) => {
        setFormDate(date);
    };

    const handleChangeFormScheduleDefinition = (event: SyntheticEvent, value: any) => {
        setFormScheduleDefinition(value);
    };

    const handleChangeFormUser = (event: SyntheticEvent, value: any) => {
        setFormUser(value);
    };


    return (
        <div className={styles.formCenter}>
            <div className={styles.form}>
                <h2 style={{color: 'black'}}>Taak Toevoegen</h2>
                <div className={styles.formFields}>
                    <FormControl required sx={{minWidth: 150}} variant="outlined">
                        <Stack spacing={2} sx={{width: 300}}>
                            <Autocomplete
                                id="gebruiker"
                                isOptionEqualToValue={(option, value) => true}
                                onChange={handleChangeFormUser}
                                options={props.allUsers.data
                                    .map((option) => option.first_name + ' ' + option.last_name)}
                                renderInput={(params) =>
                                    <TextField {...params} label="gebruiker" />
                                }
                            />
                        </Stack>
                    </FormControl>
                    <FormControl required sx={{minWidth: 150}} variant="outlined">
                        <Stack spacing={2} sx={{width: 300}}>
                            <Autocomplete
                                id="route"
                                isOptionEqualToValue={(option, value) => true}
                                onChange={handleChangeFormScheduleDefinition}
                                value={formScheduleDefinition}
                                options={props.allRoutes.data
                                    .map((option) => option.name)}
                                renderInput={(params) =>
                                    <TextField {...params} label="route"/>
                                }
                            />
                        </Stack>
                    </FormControl>
                    <FormControl required sx={{minWidth: 150}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoItem label="Responsive variant">
                                <DatePicker
                                    value={dayjs(formDate)}
                                    onChange={handleChangeFormDate}
                                />
                            </DemoItem>
                        </LocalizationProvider>
                    </FormControl>
                </div>
                <div className={styles.formButtons}>
                    <Button variant="contained" className={styles.button} onClick={handleClose}>
                            Cancel
                    </Button>
                    <Button variant="contained" className={styles.button} onClick={handleSubmitForm}
                        style={{backgroundColor: '#E6E600'}}>
                            Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
