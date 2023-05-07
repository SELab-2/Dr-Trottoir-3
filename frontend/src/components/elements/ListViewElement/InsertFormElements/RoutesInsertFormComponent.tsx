import React from 'react';
import {ClickAwayListener} from '@mui/base';
import styles from '@/styles/listView.module.css';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from '@mui/material';
import {LocationGroup, ScheduleDefinition} from '@/api/models';
import {postScheduleDefinition} from '@/api/api';
import {useSession} from 'next-auth/react';

type FormProps = {
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allRegions: LocationGroup[],
    allRoutes: ScheduleDefinition[],
}

export default function Form({setCanClose, canClose, setOpen, allRegions, allRoutes}: FormProps) {
    const {data: session} = useSession();
    const handleSubmitForm = () =>{
        const prevVers = allRoutes.filter((e) => {
            return (e.name === formName);
        });
        let version = 1;
        if (prevVers.length > 0) {
            version = prevVers[prevVers.length-1].version + 1;
        }
        postScheduleDefinition(session, {
            name: formName,
            version: version,
            location_group: formRegion,
        });
        handleClose();
    };

    const handleClose = () => {
        if (canClose) {
            setOpen(false);
        }
    };

    const [formName, setFormName] = React.useState('');
    // const handleChangeFormName = (event: SelectChangeEvent) => {
    //     setFormName(event.target.value as string);
    // };

    const [formRegion, setFormRegion] = React.useState<LocationGroup>();
    const handleChangeFormRegion = (event: SelectChangeEvent) => {
        setFormRegion(event.target.value as unknown as LocationGroup);
    };

    React.useEffect(() =>{
        setCanClose(true);
    });
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <h2 style={{color: 'black'}}>Route Toevoegen</h2>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField
                                fullWidth
                                required
                                label="naam"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value as string)}
                            />
                        </div>
                        <FormControl required sx={{width: '100'}}>
                            <InputLabel>regio</InputLabel>
                            <Select
                                value={formRegion?.name}
                                onChange={handleChangeFormRegion}
                                label="regio"
                                defaultValue=""
                                MenuProps={{disablePortal: true}}
                            >
                                {allRegions.map((option) => (
                                    <MenuItem id="menuitem" key={option.id} value={option.id}
                                        style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
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
}
