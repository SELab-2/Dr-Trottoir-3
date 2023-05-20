import React, {SyntheticEvent, useEffect, useState} from 'react';
import {Building, Student, Syndicus} from '@/api/models';
import {getBuildingsList, patchUserDetail, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import {
    Autocomplete,
    Button,
    Checkbox,
    Dialog,
    DialogTitle,
    FormControl,
    FormControlLabel,
    TextField,
} from '@mui/material';
import styles from '@/styles/forms.module.css';


type EditUserPopupProps = {
    userId: number,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    prevFirstName: string,
    prevLastName: string,
    prevStudent: Student | undefined,
    prevSyndic: Syndicus | undefined,
}

export default function EditUserPopup({userId, open, setOpen, prevFirstName, prevLastName, prevStudent,
    prevSyndic}: EditUserPopupProps) {
    const {data: session} = useSession();

    const [allBuildings, setAllBuildings] = useAuthenticatedApi<Building[]>();

    useEffect(() => {
        getBuildingsList(session, setAllBuildings);
    }, [session]);

    const [formFirstName, setFormFirstName] = useState(prevFirstName);
    const [formLastName, setFormLastName] = useState(prevLastName);
    const [formStudent, setFormStudent] = useState(prevStudent);
    const [formIsSuperStudent, setFormIsSuperStudent] = useState(false);
    const [formSyndicus, setFormSyndicus] = useState(prevSyndic);
    const [selectedBuildings, setSelectedBuildings] = useState<Building[]>([]);

    useEffect(() => {
        if (prevSyndic && allBuildings) {
            const blds: Building[] = [];
            prevSyndic.buildings.map((b) => {
                blds.push(allBuildings.data[allBuildings.data.findIndex((o) => o.id == b)]);
            });
            setSelectedBuildings(blds);
        }
    }, [allBuildings, open]);

    useEffect(() => {
        setFormFirstName(prevFirstName);
        setFormLastName(prevLastName);
        setFormStudent(prevStudent);
        setFormSyndicus(prevSyndic);
        if (prevStudent) {
            setFormIsSuperStudent(prevStudent.is_super_student);
        }
    }, [open]);

    const handleSubmit = () =>{
        const blds: number[] = [];
        selectedBuildings.map((b) => {
            blds.push(b.id);
        });
        if (formSyndicus) {
            formSyndicus.buildings = blds;
        }
        if (formStudent) {
            formStudent.is_super_student = formIsSuperStudent;
        }
        patchUserDetail(session, userId, {
            first_name: formFirstName,
            last_name: formLastName,
            student: formStudent,
            syndicus: formSyndicus,
        });
        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChangeBuildings = (event: SyntheticEvent<Element, Event>, value: React.SetStateAction<Building[]>) => {
        // const value = event.target;
        setSelectedBuildings(value);
    };

    if (!allBuildings || !allBuildings.data) {
        return (
            <>Loading</>
        );
    }

    const typeSpecificFields = () => {
        if (formStudent) {
            return (
                <>
                    <div className={styles.field}>
                        <FormControlLabel control={<Checkbox
                            sx={{
                                '&.Mui-checked': {
                                    color: 'var(--primary-yellow)',
                                },
                            }}
                            defaultChecked={prevStudent?.is_super_student}
                            value={formIsSuperStudent}
                            onChange={() => {
                                setFormIsSuperStudent(!formIsSuperStudent);
                            }} />}
                        label="superstudent" sx={{color: 'black'}}/>
                    </div>
                </>
            );
        } else if (formSyndicus) {
            const tmp = allBuildings.data;
            return (
                <>
                    <div className={styles.field}>
                        <FormControl sx={{marginBottom: 1, marginTop: 1, width: 200}}>
                            <Autocomplete
                                multiple
                                id="tags-standard"
                                options={tmp}
                                getOptionLabel={(option) => option.name}
                                defaultValue={[]}
                                value={selectedBuildings}
                                onChange={handleChangeBuildings}
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
                    </div>
                </>

            );
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Gebruiker aanpassen</DialogTitle>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField fullWidth
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
                                required
                                label='voornaam'
                                value={formFirstName}
                                onChange={(e) => setFormFirstName(e.target.value as string)
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <TextField fullWidth
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
                                required
                                label='achternaam'
                                value={formLastName}
                                onChange={(e) => setFormLastName(e.target.value as string)
                                }
                            />
                        </div>
                        {typeSpecificFields()}
                    </div>
                    <div className={styles.formButtons}>
                        <Button className={styles.cancel_button} onClick={handleClose}>
                            Annuleren
                        </Button>
                        <Button className={styles.submit_button} onClick={handleSubmit}>
                            Toevoegen
                        </Button>
                    </div>
                </div>
            </div>

        </Dialog>
    );
}
