import React, {SyntheticEvent} from 'react';
import {
    Autocomplete,
    Button,
    Checkbox, Dialog, DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel, MenuItem,
    Select,
    TextField,
} from '@mui/material';
import styles from '@/styles/forms.module.css';
import {Building, LocationGroup} from '@/api/models';
import {postUser} from '@/api/api';
import {useSession} from 'next-auth/react';

type FormProps = {
    onSubmit: () => void,
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allBuildings: Building[],
    allRegions: LocationGroup[],
    open: boolean
}

export default function Form(props: FormProps) {
    const {data: session} = useSession();
    const [formUsername, setFormUsername] = React.useState('');
    const [formFirstName, setFormFirstName] = React.useState('');
    const [formLastName, setFormLastName] = React.useState('');
    const [formUserType, setFormUserType] = React.useState('');
    const [formIsSuperStudent, setFormIsSuperStudent] = React.useState(false);
    const [selectedBuildings, setSelectedBuildings] = React.useState<Building[]>([]);
    const [formRegion, setFormRegion] = React.useState<LocationGroup | null>(null);

    const userTypes = {
        student: 'student',
        syndicus: 'syndicus',
        admin: 'admin',
    };

    const handleSubmitForm = () =>{
        const blds: number[] = [];
        selectedBuildings.map((b) => {
            blds.push(b.id);
        });
        const postData: Record<string, any> = {};
        postData.username = formUsername;
        postData.first_name = formFirstName;
        postData.last_name = formLastName;
        postData.admin = null;
        postData.student = null;
        postData.syndicus = null;
        if (formUserType === 'admin') {
            postData.admin = {};
        } else if (formUserType === 'student') {
            postData.student = {
                location_group: formRegion,
                is_super_student: formIsSuperStudent,
            };
        } else if (formUserType == 'syndicus') {
            postData.syndicus = {
                buildings: blds,
            };
        }
        postUser(session, postData, () => {
            setFormFirstName('');
            setFormUsername('');
            setFormRegion(null);
            setFormIsSuperStudent(false);
            setFormLastName('');
            setFormUserType('');
            setSelectedBuildings([]);
            props.onSubmit();
        });
        handleClose();
    };

    const handleClose = () => {
        if (props.canClose) {
            props.setOpen(false);
        }
    };

    const handleChangeBuildings = (event: SyntheticEvent<Element, Event>, value: React.SetStateAction<Building[]>) => {
        // const value = event.target;
        setSelectedBuildings(value);
    };

    const buildingsOrSuperStudentField = (userType: string) => {
        if (userType === 'student') {
            return (
                <>
                    <div className={styles.field}>
                        <FormControlLabel control={<Checkbox
                            sx={{
                                '&.Mui-checked': {
                                    color: 'var(--primary-yellow)',
                                },
                            }}
                            defaultChecked={false} value={formIsSuperStudent}
                            onChange={() => setFormIsSuperStudent(!formIsSuperStudent)} />}
                        label="superstudent" sx={{color: 'black'}}/>
                    </div>
                    <div className={styles.field}>
                        <FormControl sx={{
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
                        >
                            <InputLabel>regio</InputLabel>
                            <Select
                                value={formRegion?.name}
                                onChange={(e) => setFormRegion(e.target.value as unknown as LocationGroup)}
                                label='regio'
                                defaultValue=''
                                MenuProps={{disablePortal: true}}
                            >
                                {props.allRegions.map((option) => (
                                    <MenuItem id='menuitem' key={option.id} value={option.id}
                                        style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </>


            );
        } else if (userType === 'syndicus') {
            return (
                <div className={styles.field}>
                    <FormControl sx={{marginBottom: 1, marginTop: 1, width: '100%'}}>
                        <Autocomplete
                            multiple
                            id="tags-outline"
                            options={props.allBuildings}
                            getOptionLabel={(option) => option.name}
                            defaultValue={[]}
                            value={selectedBuildings}
                            onChange={handleChangeBuildings}
                            renderInput={(params) => (
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
                                    {...params}
                                    label="gebouwen"
                                    placeholder="gebouwen"
                                />
                            )}
                        />
                    </FormControl>
                </div>
            );
        } else {
            return (
                <div></div>
            );
        }
    };

    React.useEffect(() =>{
        props.setCanClose(true);
    });
    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle>Gebruiker toevoegen</DialogTitle>
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
                                label="gebruikersnaam"
                                value={formUsername}
                                onChange={(e) => setFormUsername(e.target.value as string)}
                            />
                        </div>
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
                                label="voornaam"
                                value={formFirstName}
                                onChange={(e) => setFormFirstName(e.target.value as string)}
                            />
                        </div>
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
                                label="achternaam"
                                value={formLastName}
                                onChange={(e) => setFormLastName(e.target.value as string)}
                            />
                        </div>
                        <div className={styles.field}>
                            <FormControl sx={{
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
                            required
                            size="small"
                            fullWidth>
                                <InputLabel>type</InputLabel>
                                <Select
                                    value={formUserType}
                                    onChange={(e) => setFormUserType(e.target.value as string)}
                                    label="type"
                                    defaultValue=""
                                    MenuProps={{disablePortal: true}}
                                >
                                    {Object.entries(userTypes).map(([option, value]) => (
                                        <MenuItem key={option} value={option}
                                            style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {buildingsOrSuperStudentField(formUserType)}

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
