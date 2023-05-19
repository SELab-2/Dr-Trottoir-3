import React from 'react';
import {ClickAwayListener} from '@mui/base';
import styles from '@/styles/forms.module.css';
import {
    Autocomplete,
    Button, Dialog,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {LocationGroup, ScheduleDefinition} from '@/api/models';
import {postScheduleDefinition} from '@/api/api';
import {useSession} from 'next-auth/react';

type FormProps = {
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allRegions: LocationGroup[],
    allRoutes: ScheduleDefinition[],
    open: boolean
}

export default function Form(props: FormProps) {
    const {data: session} = useSession();
    const handleSubmitForm = () =>{
        const prevVers = props.allRoutes.filter((e) => {
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
        if (props.canClose) {
            props.setOpen(false);
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
        props.setCanClose(true);
    });
    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Route toevoegen</DialogTitle>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        padding: '2px',
                                    },
                                    '& label.Mui-focused': {
                                        color: 'var(--primary-yellow)',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'var(--primary-yellow)',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'var(--secondary-light)',
                                            borderRadius: '8px',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--secondary-light)',
                                            borderRadius: '8px',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--primary-yellow)',
                                            borderRadius: '8px',
                                        },
                                    },
                                }}
                                size="small"
                                InputProps={{
                                    style: {height: '45px'},
                                }}
                                fullWidth
                                required
                                label="naam"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value as string)}
                            />
                        </div>
                        <div className={styles.field}>
                            <Autocomplete
                                sx={{
                                    '& .MuiInputLabel-root': {
                                        padding: '2px',
                                    },
                                    '& label.Mui-focused': {
                                        color: 'var(--primary-yellow)',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiInput-underline:after': {
                                        borderBottomColor: 'var(--primary-yellow)',
                                        borderRadius: '8px',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'var(--secondary-light)',
                                            borderRadius: '8px',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--secondary-light)',
                                            borderRadius: '8px',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--primary-yellow)',
                                            borderRadius: '8px',
                                        },
                                    },
                                }}
                                size="small"
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Afval Type"/>}
                                options={props.allRegions}
                                getOptionLabel={({name}) => name}
                                value={formRegion}
                                // @ts-ignore
                                onChange={(e) => setFormRegion(e.target.value as LocationGroup)}
                            />
                        </div>
                    </div>
                    <div className={styles.formButtons}>
                        <Button className={styles.cancel_button} onClick={handleClose}>
                            Annuleren
                        </Button>
                        <Button className={styles.submit_button} onClick={handleSubmitForm}
                            style={{backgroundColor: '#E6E600'}}>
                            Toevoegen
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
