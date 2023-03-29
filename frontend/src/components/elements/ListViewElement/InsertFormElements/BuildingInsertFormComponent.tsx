import React from 'react';
import {ClickAwayListener} from '@mui/base';
import styles from '@/components/elements/buildingsListElement/listView.module.css';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from '@mui/material';

const BuildingInsertFormComponent = ()=>{
    const [open, setOpen] = React.useState(false);

    const [canClose, setCanClose] = React.useState(true);
    const handleClose = () => {
        if (canClose) {
            setOpen(false);
        }
    };

    const handleSubmitForm = () =>{

    };

    const [formName, setFormName] = React.useState('');
    const handleChangeFormName = (event: SelectChangeEvent) => {
        setFormName(event.target.value as string);
    };

    const [formAdres, setFormAdres] = React.useState('');
    const handleChangeFormAdres = (event: SelectChangeEvent) => {
        setFormAdres(event.target.value as string);
    };

    const [formRegion, setFormRegion] = React.useState('');
    const handleChangeFormRegion = (event: SelectChangeEvent) => {
        setFormRegion(event.target.value as string);
    };

    const [formSyndic, setFormSyndic] = React.useState('');
    const handleChangeFormSyndic = (event: SelectChangeEvent) => {
        setFormSyndic(event.target.value as string);
    };

    React.useEffect(() =>{
        setCanClose(true);
    });
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <h2 style={{color: 'black'}}>Gebouw Toevoegen</h2>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField
                                required
                                label="naam"
                                value={formName}
                                onChange={handleChangeFormName}
                            />
                        </div>
                        <FormControl required sx={{minWidth: 150}}>
                            <InputLabel>regio</InputLabel>
                            <Select
                                value={formRegion}
                                onChange={handleChangeFormRegion}
                                label="regio"
                                defaultValue=""
                                MenuProps={{disablePortal: true}}
                            >
                                {dummyRegions.map((option) => (
                                    <MenuItem id="menuitem" key={option} value={option} style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className={styles.field}>
                            <TextField
                                required
                                label="adres"
                                value={formAdres}
                                onChange={handleChangeFormAdres}
                            />
                        </div>
                        <FormControl sx={{minWidth: 200}}>
                            <InputLabel>syndicus</InputLabel>
                            <Select
                                value={formSyndic}
                                onChange={handleChangeFormSyndic}
                                label="syndicus"
                                defaultValue=""
                                MenuProps={{disablePortal: true}}
                            >
                                <MenuItem value="">
                                    <em>geen</em>
                                </MenuItem>
                                {dummySindici.map((option) => (
                                    <MenuItem id="menuitem" key={option.name} value={option.name} style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
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
                        <Button variant="contained" className={styles.button} onClick={handleSubmitForm} style={{backgroundColor: '#E6E600'}}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </ClickAwayListener>
    );
};


export default BuildingInsertFormComponent;
