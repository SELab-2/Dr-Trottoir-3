import React from 'react';
import {ClickAwayListener} from '@mui/base';
import styles from '@/styles/listView.module.css';
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from '@mui/material';
import {LocationGroup} from '@/api/models';
import {postBuilding} from '@/api/api';
import {useSession} from 'next-auth/react';

const dummySindici = [
    {name: 'Jan Tomas'},
    {name: 'Peter Selie'},
    {name: 'Wily Willson'},
];

type FormProps = {
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allRegions: LocationGroup[],
}

export default function Form({setCanClose, canClose, setOpen, allRegions}: FormProps) {
    const {data: session} = useSession();

    const handleClose = () => {
        if (canClose) {
            setOpen(false);
        }
    };

    const handleSubmitForm = () =>{
        postBuilding(session, {
            address: formAddress,
            pdf_guide: null,
            is_active: false,
            description: formDescription,
            image: null,
            location_group: formRegion,
        });
        handleClose();
    };

    const [formName, setFormName] = React.useState('');
    const handleChangeFormName = (event: SelectChangeEvent) => {
        setFormName(event.target.value as string);
    };

    const [formAddress, setFormAddress] = React.useState('');
    const handleChangeFormAdres = (event: SelectChangeEvent) => {
        setFormAddress(event.target.value as string);
    };

    const [formRegion, setFormRegion] = React.useState<LocationGroup>();
    const handleChangeFormRegion = (event: SelectChangeEvent) => {
        setFormRegion(event.target.value as LocationGroup);
    };

    const [formSyndic, setFormSyndic] = React.useState('');
    const handleChangeFormSyndic = (event: SelectChangeEvent) => {
        setFormSyndic(event.target.value as string);
    };

    const [formDescription, setFormDescription] = React.useState('');

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
                                onChange={(e) => setFormName(e.target.value as string)
                                }
                            />
                        </div>
                        <FormControl required sx={{minWidth: 150}}>
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
                        <div className={styles.field}>
                            <TextField
                                required
                                label="adres"
                                value={formAddress}
                                onChange={(e) => setFormAddress(e.target.value as string)}
                            />
                        </div>
                        <div className={styles.field}>
                            <TextField
                                required
                                multiline
                                rows={4}
                                label="beschrijving"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value as string)}
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
                                    <MenuItem id="menuitem" key={option.name} value={option.name}
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
