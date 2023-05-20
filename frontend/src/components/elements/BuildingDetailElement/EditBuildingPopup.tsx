import styles from '@/styles/forms.module.css';
import {User} from '@/api/models';
import {
    Autocomplete,
    Box, Button,
    Dialog,
    DialogTitle,
    FormControl,
    IconButton,
    TextField,
} from '@mui/material';
import {getUsersList, patchBuildingDetail, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {LatLng} from 'leaflet';
import {PinDrop} from '@mui/icons-material';
import BuildingMapSelector from '@/components/elements/ListViewElement/InsertFormElements/BuildingMapSelector';
import CloseIcon from '@mui/icons-material/Close';

type EditBuildingPopupProps = {
    buildingId: number,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    prevName: string,
    prevAddress: string,
    prevLongitude: number | null,
    prevLatitude: number | null,
    prevSyndici: User[],
    prevDescription: string,
}

export default function EditBuildingPopup({open, setOpen, prevName, prevAddress, prevLongitude, prevLatitude,
    prevSyndici, prevDescription, buildingId}: EditBuildingPopupProps) {
    const {data: session} = useSession();
    const [allSyndici, setAllSyndici] = useAuthenticatedApi<User[]>();

    const [formName, setFormName] = useState(prevName);
    const [formAddress, setFormAddress] = React.useState(prevAddress);
    const [formAddressError, setFormAddressError] = React.useState(false);
    const [formCoordinate, setFormCoordinate] = prevLongitude && prevLatitude ?
        React.useState<LatLng>(new LatLng(prevLatitude, prevLongitude)) :
        React.useState<LatLng>(new LatLng(51.1576985, 4.0807745));
    const [formSyndici, setFormSyndici] = React.useState<User[]>(prevSyndici);
    const [formDescription, setFormDescription] = React.useState(prevDescription);
    const [formPDFGuide, setFormPDFGuide] = React.useState<File | null>(null);

    useEffect(() => {
        getUsersList(session, setAllSyndici, {syndicus__id__gt: 0});
    }, [session]);

    useEffect(() => {
        setFormName(prevName);
        setFormAddress(prevAddress);
        prevLongitude && prevLatitude ?
            setFormCoordinate(new LatLng(prevLatitude, prevLongitude)) :
            setFormCoordinate(new LatLng(51.1576985, 4.0807745));
        setFormSyndici(prevSyndici);
        setFormDescription(prevDescription);
    }, [open]);

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('name', formName);
        formData.append('address', formAddress);
        formData.append('latitude', formCoordinate.lat.toString());
        formData.append('longitude', formCoordinate.lng.toString());
        formData.append('description', formDescription);
        formData.append('is_active', false.toString());
        if (formPDFGuide !== null) {
            formData.append('pdf_guide', formPDFGuide, formPDFGuide.name);
        } else {
            patchBuildingDetail(session, buildingId, {
                pdf_guide: null,
            });
        }

        patchBuildingDetail(session, buildingId, formData);
        const syndics: number[] = [];
        formSyndici.forEach((s) => {
            if (s.syndicus) {
                syndics.push(s.syndicus.id);
            }
        });
        patchBuildingDetail(session, buildingId, {
            syndici: syndics,
        });
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!allSyndici) {
        return (
            <>Loading</>
        );
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Gebouw aanpassen</DialogTitle>
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
                                multiple
                                options={allSyndici.data}
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
                                    id={`building-${buildingId}-create-manual-pdf-button`}
                                    type="file"
                                    onChange={(e) => setFormPDFGuide(e.target.files ? e.target.files[0] : null)}
                                    accept="application/pdf"
                                    hidden
                                />
                            </Button>
                            <IconButton onClick={() => {
                                setFormPDFGuide(null);
                                const pdfButton = document.getElementById(`manual-pdf-button-building-${buildingId}`);
                                if (pdfButton) {
                                    // @ts-ignore
                                    pdfButton.value = null;
                                }
                            }}
                            >
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
                    </div>
                    <div className={styles.formButtons}>
                        <Button className={styles.cancel_button} onClick={handleClose}>
                            Annuleer
                        </Button>
                        <Button className={styles.submit_button} onClick={handleSubmit}>
                            Accepteer
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
