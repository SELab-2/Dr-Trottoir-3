import React from 'react';
import {
    Backdrop,
    Button, Checkbox,
    FormControl,
    IconButton, InputBase,
    InputLabel, ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import styles from '@/styles/ListView.module.css';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {Building, LocationGroup} from '@/api/models';
import Form from '../InsertFormElements/UserInsertFormComponent';
import {Person} from '@mui/icons-material';

type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>,
    selectedRegions: LocationGroup[],
    setSelectedRegions: React.Dispatch<React.SetStateAction<LocationGroup[]>>,
    allRegions: LocationGroup[],
    amountOfResults: number,
    searchEntry: string,
    setSearchEntry: React.Dispatch<React.SetStateAction<string>>,
    selectedUserType: string,
    setSelectedUserType: React.Dispatch<React.SetStateAction<string>>,
    allBuildings: Building[],
}

export default function UserTopBarComponent({sorttype, setSorttype, selectedRegions, setSelectedRegions, allRegions, amountOfResults,
    searchEntry, setSearchEntry, selectedUserType, setSelectedUserType,
    allBuildings}:TopBarProps) {
    const AllesSelectedRegions = selectedRegions.length>=allRegions.length;

    const handleChangeRegion = (event: SelectChangeEvent<LocationGroup[]>) => {
        const value = event.target.value as LocationGroup[];
        setSelectedRegions(
            (value.indexOf('Alles')>-1)?
                (AllesSelectedRegions)?
                    []:
                    allRegions:
                value );
    };


    const userTypes = {
        student: 'studenten',
        super_student: 'super studenten',
        syndicus: 'syndici',
        admin: 'admins',
    };


    const handleChangeUserType = (event: SelectChangeEvent<string[]>) => {
        setSelectedUserType(event.target.value as string);
    };

    const sorttypes = {
        first_name: 'voornaam',
        last_name: 'familienaam',
    };

    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };


    const [open, setOpen] = React.useState(false);

    const [canClose, setCanClose] = React.useState(true);

    const handleToggle = () => {
        setCanClose(false);
        setOpen(!open);
    };


    return (
        <div className={styles.topBar}>
            <div className={styles.search}>
                <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                    <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{p: '5px'}}
                        autoComplete={'true'}
                        fullWidth={true}
                        placeholder="Zoek op naam"
                        value={searchEntry}
                        onChange={handleChangeSearchEntry}
                    />
                </Box>
            </div>
            <div className={styles.generic_wrapper}>
                <div className={styles.filter_wrapper}>
                    <div className={styles.filters}>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel>Sorteer op</InputLabel>
                            <Select
                                style={{width: 200}}
                                IconComponent={() => (
                                    <SortIcon/>
                                )}
                                value={sorttype}
                                onChange={handleChangeSorttype}
                                label="Sorteer op"
                            >
                                {Object.keys(sorttypes).map((option) => (
                                    <MenuItem key={option} value={option} style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {sorttypes[option]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className={styles.filters}>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <Select
                                displayEmpty={true}
                                multiple
                                value={selectedRegions}
                                onChange={handleChangeRegion}
                                renderValue={() => 'regio'}
                            >
                                <MenuItem key={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')} value={'Alles'}>
                                    <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelectedRegions} />
                                    <ListItemText style ={{width: 150}}
                                        primary={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')} />
                                </MenuItem>
                                {allRegions.map((option) => (
                                    <MenuItem key={option.name} value={option}>
                                        <Checkbox style ={{color: '#1C1C1C'}}
                                            checked={selectedRegions?.indexOf(option) > -1} />
                                        <ListItemText primaryTypographyProps=
                                            {{style: {whiteSpace: 'normal', wordBreak: 'break-all'}}}
                                        primary={option.name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.filters}>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                style={{width: 150}}
                                IconComponent={() => (
                                    <Person/>
                                )}
                                value={selectedUserType}
                                onChange={handleChangeUserType}
                                label="Sorteer op"
                            >
                                <MenuItem key={'alles'} value={''} style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                    {'Alle'}
                                </MenuItem>
                                {Object.keys(userTypes).map((option) => (
                                    <MenuItem key={option} value={option} style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {userTypes[option]}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Button variant="contained" className={styles.button} onMouseUp={handleToggle}>
                    <AddIcon />
                    Gebruiker Toevoegen
                </Button>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={open}
                    invisible={false}
                >
                    <Form setCanClose={setCanClose} canClose={canClose} setOpen={setOpen}
                        allBuildings={allBuildings}></Form>
                </Backdrop>
            </div>
        </div>


    );
}
