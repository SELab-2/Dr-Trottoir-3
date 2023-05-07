import React from 'react';
import {ClickAwayListener} from '@mui/base';
import styles from '@/styles/listView.module.css';
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import {LocationGroup, User} from '@/api/models';
import {postBuilding} from '@/api/api';
import {useSession} from 'next-auth/react';
import {LatLng} from 'leaflet';
import BuildingMapSelector from '@/components/elements/ListViewElement/InsertFormElements/BuildingMapSelector';
import axios from 'axios';
import {PinDrop} from '@mui/icons-material';


type FormProps = {
    setCanClose: React.Dispatch<React.SetStateAction<boolean>>,
    canClose: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    allRegions: LocationGroup[],
    allSyndici: User[],
}

export default function Form({setCanClose, canClose, setOpen, allRegions, allSyndici}: FormProps) {
    const {data: session} = useSession();

    const handleClose = () => {
        if (canClose) {
            setOpen(false);
        }
    };

    const handleSubmitForm = () => {
        postBuilding(session, {
            name: formName,
            address: formAddress,
            latitude: formCoordinate.lat,
            longitude: formCoordinate.lng,
            pdf_guide: null,
            is_active: false,
            description: formDescription,
            image: null,
            location_group: formRegion,
        });
        handleClose();
    };

    const [formName, setFormName] = React.useState('');
    const [formAddress, setFormAddress] = React.useState('');
    const [formAddressError, setFormAddressError] = React.useState(false);
    const [formCoordinate, setFormCoordinate] = React.useState<LatLng>(new LatLng(51.1576985, 4.0807745));
    const [formRegion, setFormRegion] = React.useState<LocationGroup>();
    const [formSyndic, setFormSyndic] = React.useState<User>();
    const [formDescription, setFormDescription] = React.useState('');


    React.useEffect(() => {
        setCanClose(true);
    });
    return (
        <ClickAwayListener onClickAway={handleClose}>
            <div className={styles.formCenter}>
                <div className={styles.form}>
                    <h2 style={{color: 'black'}}>Gebouw Toevoegen</h2>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <TextField fullWidth
                                required
                                label='naam'
                                value={formName}
                                onChange={(e) => setFormName(e.target.value as string)
                                }
                            />
                        </div>
                        <FormControl required sx={{minWidth: 150}}>
                            <InputLabel>regio</InputLabel>
                            <Select
                                value={formRegion?.name}
                                onChange={(e) => setFormRegion(e.target.value as unknown as LocationGroup)}
                                label='regio'
                                defaultValue=''
                                MenuProps={{disablePortal: true}}
                            >
                                {allRegions.map((option) => (
                                    <MenuItem id='menuitem' key={option.id} value={option.id}
                                        style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {option.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className={styles.field}>
                            <TextField error={formAddressError}
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
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label='beschrijving'
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value as string)}
                            />
                        </div>
                        <FormControl sx={{marginBottom: 1, marginTop: 1, width: '100%'}}>
                            <Autocomplete
                                id="tags-standard"
                                options={allSyndici}
                                getOptionLabel={(option) => option.first_name[0] + '. ' + option.last_name}
                                value={formSyndic}
                                onChange={(e, v) => {
                                    if (v !== null) {
                                        setFormSyndic(v);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="syndicus"
                                        placeholder="syndicus"
                                    />
                                )}
                            />
                        </FormControl>
                    </div>
                    <div className={styles.formButtons}>
                        <Button variant='contained' className={styles.button} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant='contained' className={styles.button} onClick={handleSubmitForm}
                            style={{backgroundColor: '#E6E600'}}>
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </ClickAwayListener>
    );
}
