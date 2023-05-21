import React, {useState} from 'react';
import styles from '@/styles/forms.module.css';
import {
    Autocomplete,
    Box,
    Button, Dialog, DialogTitle,
    FormControl,
    IconButton,
    TextField,
} from '@mui/material';
import {LocationGroup, User} from '@/api/models';
import {postBuilding} from '@/api/api';
import {useSession} from 'next-auth/react';
import {LatLng} from 'leaflet';
import BuildingMapSelector from '@/components/elements/ListViewElement/InsertFormElements/BuildingMapSelector';
import axios from 'axios';
import {PinDrop} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';


type FormProps = {
    onSubmit: () => void,
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allRegions: LocationGroup[],
    allSyndici: User[],
    open: boolean
}

export default function Form({onSubmit, setCanClose, canClose, setOpen, open, allRegions, allSyndici}: FormProps) {
    const {data: session} = useSession();

    const handleClose = () => {
        if (canClose) {
            setOpen(false);
        }
    };

    const handleSubmitForm = () => {
        const formData = new FormData();
        formData.append('name', formName);
        formData.append('address', formAddress);
        formData.append('latitude', formCoordinate.lat.toString());
        formData.append('longitude', formCoordinate.lng.toString());
        formData.append('description', formDescription);
        formData.append('is_active', false.toString());
        formData.append('location_group', formRegion ? formRegion.id.toString() : '');
        if (formPDFGuide !== null) {
            formData.append('pdf_guide', formPDFGuide, formPDFGuide.name);
        }
        if (formImage !== null) {
            formData.append('image', formImage, formImage.name);
        }
        formSyndici.forEach((s) => {
            if (s.syndicus) {
                formData.append('syndici', s.syndicus.id.toString());
            }
        });

        postBuilding(session, formData, () => {
            setFormName('');
            setFormAddress('');
            setFormAddressError(false);
            setFormCoordinate(new LatLng(51.1576985, 4.0807745));
            setFormRegion(null);
            setFormSyndici([]);
            setFormDescription('');
            setFormPDFGuide(null);
            setFormImage(null);
            onSubmit();
        });
        handleClose();
    };

    const [formName, setFormName] = useState('');
    const [formAddress, setFormAddress] = useState('');
    const [formAddressError, setFormAddressError] = useState(false);
    const [formCoordinate, setFormCoordinate] = useState<LatLng>(new LatLng(51.1576985, 4.0807745));
    const [formRegion, setFormRegion] = useState<LocationGroup | null>(null);
    const [formSyndici, setFormSyndici] = useState<User[]>([]);
    const [formDescription, setFormDescription] = useState('');
    const [formPDFGuide, setFormPDFGuide] = React.useState<File | null>(null);
    const [formImage, setFormImage] = useState<File | null>(null);

    React.useEffect(() => {
        setCanClose(true);
    });
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Gebouw toevoegen</DialogTitle>
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
                                className={styles.input}
                                fullWidth
                                required
                                label='naam'
                                value={formName}
                                onChange={(e) => setFormName(e.target.value as string)
                                }
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
                                renderInput={(params) => <TextField {...params} label="Regio"/>}
                                options={allRegions}
                                getOptionLabel={({name}) => name}
                                value={formRegion}
                                // @ts-ignore
                                onChange={(e, v) => setFormRegion(v)}
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
                                className={styles.input}
                                fullWidth
                                error={formAddressError}
                                required
                                label='adres'
                                value={formAddress}
                                onChange={(e) => setFormAddress(e.target.value as string)}
                            />
                            <IconButton onClick={() => {
                                axios
                                    .get(`https://nominatim.openstreetmap.org/search?format=json&q=${formAddress}`)
                                    .then(({data}) => {
                                        if (data[0]) {
                                            setFormCoordinate(new LatLng(data[0].lat, data[0].lon));
                                            setFormAddressError(false);
                                        } else setFormAddressError(true);
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            }}>
                                <PinDrop/>
                            </IconButton>
                        </div>
                        <Box width={'100%'} height={150}>
                            <BuildingMapSelector coordinate={formCoordinate} setCoordinate={setFormCoordinate}/>
                        </Box>
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
                                className={styles.input}
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label='beschrijving'
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value as string)}
                            />
                        </div>
                        <FormControl sx={{marginBottom: 1, marginTop: 1, width: 200}}>
                            <Autocomplete
                                id="tags-outline"
                                fullWidth
                                multiple
                                options={allSyndici}
                                freeSolo={false}
                                popupIcon={''}
                                getOptionLabel={(option) => option.first_name[0] + '. ' + option.last_name}
                                value={formSyndici}
                                defaultValue={[]}
                                onChange={(e, v) => {
                                    if (v !== null) {
                                        setFormSyndici(v);
                                    }
                                }}
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
                                        label="syndicus"
                                        placeholder="syndicus"
                                    />
                                )}
                            />
                        </FormControl>
                        <div className={styles.field}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{'width': 240, 'fontSize': 12, 'backgroundColor': 'var(--primary-dark)',
                                    '&:hover': {
                                        backgroundColor: 'var(--secondary-dark)',
                                    }}}
                            >
                                Handleiding (PDF)
                                <input
                                    type="file"
                                    onChange={(e) => setFormPDFGuide(e.target.files ? e.target.files[0] : null)}
                                    accept="application/pdf"
                                    hidden
                                />
                            </Button>
                            <IconButton onClick={() => setFormPDFGuide(null)}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                        <p style={{fontSize: 14}} className={styles.field}>
                            {
                                formPDFGuide ?
                                    (formPDFGuide.name.length > 40 ?
                                        formPDFGuide.name.slice(0, 37) +'...' :
                                        formPDFGuide.name
                                    ) :
                                    ''
                            }
                        </p>
                        <div className={styles.field}>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{'width': 240, 'fontSize': 12, 'backgroundColor': 'var(--primary-dark)',
                                    '&:hover': {
                                        backgroundColor: 'var(--secondary-dark)',
                                    }}}
                            >
                                Afbeelding
                                <input
                                    type="file"
                                    onChange={(e) => setFormImage(e.target.files ? e.target.files[0] : null)}
                                    accept="image/*"
                                    hidden
                                />
                            </Button>
                            <IconButton onClick={() => setFormImage(null)}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                        <p style={{fontSize: 14}} className={styles.field}>
                            {
                                formImage ?
                                    (formImage.name.length > 40 ?
                                        formImage.name.slice(0, 37) +'...' :
                                        formImage.name
                                    ) :
                                    ''
                            }
                        </p>
                    </div>
                    <div className={styles.formButtons}>
                        <Button className={styles.cancel_button} onClick={handleClose}>
                            Annuleren
                        </Button>
                        <Button className={styles.submit_button} onClick={handleSubmitForm}>
                            Toevoegen
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
