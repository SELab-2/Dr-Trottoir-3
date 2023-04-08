import React, {useState} from 'react';
import styles from './TaskForm.module.css';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select, TextField,
} from '@mui/material';
import {ClickAwayListener} from '@mui/base';
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import {Dayjs} from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers';

type props = {
    routes: any,
    users: any,
    setEditorState: any,
    addTask: any,
    editorState: any,
}

export default function CreateActiveTaskForm({routes, users, setEditorState, addTask, editorState}:props) {

    const [user, setUser] = useState<any|null>(editorState.user);
    const [route, setRoute] = useState<any|null>(editorState.route);
    const [date, setDate] = useState<Dayjs|null>(editorState.date);

    const handleClose = () => {
        setEditorState({active: false, date: null, route: null, user: null});
    };

    const handleSubmitForm = () => {
        addTask(user, route, date, 'once');
        setEditorState({active: false, date: null, route: null, user: null});
    };

    const Form = () => {
        return (
            <ClickAwayListener onClickAway={handleClose}>
                <div className={styles.formCenter}>
                    <div className={styles.form}>
                        <h2 style={{color: 'black'}}>nieuwe taak</h2>
                        <div className={styles.formFields}>
                            <FormControl required sx={{minWidth: 150}}>
                                <InputLabel>route</InputLabel>
                                <Select
                                    value={route}
                                    onChange={(e) => setRoute(e.target.value)}
                                    label="route"
                                    defaultValue=""
                                    MenuProps={{disablePortal: true}}
                                >
                                    {routes.map((route) => (
                                        <MenuItem id="menuitem" key={route} value={route}
                                            style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                            {route.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{minWidth: 200}}>
                                <InputLabel>gebruiker</InputLabel>
                                <Select
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    label="gebruiker"
                                    defaultValue=""
                                    MenuProps={{disablePortal: true}}
                                >
                                    {users.map((user) => (
                                        <MenuItem id="menuitem" key={user.name} value={user.name}
                                            style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                            {user.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl>
                                <InputLabel>datum</InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DesktopDatePicker
                                        label="Date desktop"
                                        inputFormat="MM/DD/YYYY"
                                        value={date}
                                        onChange={(e:Dayjs|null) => setDate(e)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
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
            </ClickAwayListener>
        );
    };

    return (
        <Form></Form>
    );
}
