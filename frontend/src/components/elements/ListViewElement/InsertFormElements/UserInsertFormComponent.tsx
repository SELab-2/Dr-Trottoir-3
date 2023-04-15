import React from 'react';
import {
    Autocomplete,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel, MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import {ClickAwayListener} from '@mui/base';
import styles from '@/styles/ListView.module.css';
import {Building} from '@/api/models';

type FormProps = {
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allBuildings: Building[],
}

export default function Form({setCanClose, canClose, setOpen, allBuildings}: FormProps) {
    const handleSubmitForm = () =>{
        handleClose();
    };

    const handleClose = () => {
        if (canClose) {
            setOpen(false);
        }
    };

    const [formFirstName, setFormFirstName] = React.useState('');
    const handleChangeFormFirstName = (event: SelectChangeEvent) => {
        setFormFirstName(event.target.value as string);
    };

    const [formLastName, setFormLastName] = React.useState('');
    const handleChangeFormSurName = (event: SelectChangeEvent) => {
        setFormLastName(event.target.value as string);
    };

    const [formUserType, setFormUserType] = React.useState('');
    const handleChangeFormType = (event: SelectChangeEvent) => {
        setFormUserType(event.target.value as string);
    };

    const [formIsSuperStudent, setFormIsSuperStudent] = React.useState(false);

    const handleChangeFormIsSuperStudent = () => {
        setFormIsSuperStudent(!formIsSuperStudent);
    };

    const userTypes = {
        student: 'student',
        syndicus: 'syndicus',
        admin: 'admin',
    };

    const BuildingsOrSuperStudentField = (userType: string) => {
        if (userType === 'student') {
            return (
                <FormControlLabel control={<Checkbox defaultChecked={false} value={formIsSuperStudent}
                    onChange={handleChangeFormIsSuperStudent} />}
                label="superstudent" sx={{color: 'black'}}/>
            );
        } else if (userType === 'syndicus') {
            return (
                <FormControl sx={{m: 1, width: 200}}>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={allBuildings}
                        getOptionLabel={(option) => option.name}
                        defaultValue={[]}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                label="Gebouwen"
                                placeholder="Gebouwen"
                            />
                        )}
                    />
                </FormControl>
            );
        } else {
            return (
                <div></div>
            );
        }
    };

    React.useEffect(() =>{
        setCanClose(true);
    });
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <h2 style={{color: 'black'}}>Gebruiker Toevoegen</h2>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField
                                required
                                label="voornaam"
                                value={formFirstName}
                                onChange={handleChangeFormFirstName}
                            />
                        </div>
                        <div className={styles.field}>
                            <TextField
                                required
                                label="achternaam"
                                value={formLastName}
                                onChange={handleChangeFormSurName}
                            />
                        </div>
                        <div className={styles.field}>
                            <FormControl sx={{minWidth: 220}} required>
                                <InputLabel>type</InputLabel>
                                <Select
                                    value={formUserType}
                                    onChange={handleChangeFormType}
                                    label="type"
                                    defaultValue=""
                                    MenuProps={{disablePortal: true}}
                                >
                                    {Object.keys(userTypes).map((option) => (
                                        <MenuItem key={option} value={option}
                                            style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                            {userTypes[option]}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={styles.field}>
                            {BuildingsOrSuperStudentField(formUserType)}
                        </div>

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
}
