import React from 'react';
import {Admin, Student, Syndicus} from '@/api/models';
import {patchUserDetail} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Button, Dialog, DialogTitle, TextField} from '@mui/material';
import styles from '@/styles/forms.module.css';


type EditUserPopupProps = {
    userId: number,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    prevFirstName: string,
    prevLastName: string,
    prevAdmin: Admin | undefined,
    prevStudent: Student | undefined,
    prevSyndic: Syndicus | undefined,
}

export default function EditUserPopup({userId, open, setOpen, prevFirstName, prevLastName, prevAdmin, prevStudent,
    prevSyndic}: EditUserPopupProps) {
    const {data: session} = useSession();

    const [formFirstName, setFormFirstName] = React.useState(prevFirstName);
    const [formLastName, setFormLastName] = React.useState(prevLastName);

    const handleSubmit = () =>{
        patchUserDetail(session, userId, {
            first_name: formFirstName,
            last_name: formLastName,
        });
        handleClose();
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Gebruiker aanpassen</DialogTitle>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField fullWidth
                                required
                                label='voornaam'
                                value={formFirstName}
                                onChange={(e) => setFormFirstName(e.target.value as string)
                                }
                            />
                        </div>
                        <div className={styles.field}>
                            <TextField fullWidth
                                required
                                label='achternaam'
                                value={formLastName}
                                onChange={(e) => setFormLastName(e.target.value as string)
                                }
                            />
                        </div>
                    </div>
                    <div className={styles.formButtons}>
                        <Button variant='contained' className={styles.button} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant='contained' className={styles.button} onClick={handleSubmit}
                            style={{backgroundColor: '#E6E600'}}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>

        </Dialog>
    );
}
