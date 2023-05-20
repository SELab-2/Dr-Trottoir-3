import React from 'react';
import {
    Backdrop,
    Button, Checkbox,
    IconButton, InputBase,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {Building, LocationGroup} from '@/api/models';
import Form from '../InsertFormElements/UserInsertFormComponent';
import {Clear, Person} from '@mui/icons-material';
import styles from './topBar.module.css';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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
    handleSearch: (b: boolean) => void,
}

export default function UserTopBarComponent({sorttype, setSorttype, selectedRegions, setSelectedRegions, allRegions,
    searchEntry, setSearchEntry, selectedUserType, setSelectedUserType,
    allBuildings, handleSearch}:TopBarProps) {
    const AllesSelectedRegions = selectedRegions.length>=allRegions.length;

    const handleChangeRegion = (event: SelectChangeEvent<LocationGroup[]>) => {
        const value = event.target.value as LocationGroup[];
        setSelectedRegions(
            // @ts-ignore
            (value.indexOf('Alles') > -1)?
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

    const sorttypes = {
        first_name: 'voornaam',
        last_name: 'familienaam',
    };

    const [open, setOpen] = React.useState(false);

    const [canClose, setCanClose] = React.useState(true);

    const handleToggle = () => {
        setCanClose(false);
        setOpen(!open);
    };


    return (
        <div className={styles.topBar}>
            <div className={styles.search_container}>
                <IconButton type="button" sx={{p: '10px'}} aria-label="search" onClick={() => handleSearch(false)}>
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{p: '5px'}}
                    autoComplete={'true'}
                    fullWidth={true}
                    value={searchEntry}
                    onChange={(e) => setSearchEntry(e.target.value as string)}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            handleSearch(false);
                        }
                    }}
                />
                <IconButton type="button" sx={{p: '10px'}} aria-label="clear" onClick={
                    (e) => {
                        setSearchEntry('');
                        handleSearch(true);
                    }
                }>
                    <Clear />
                </IconButton>
            </div>
            <div className={styles.filters_container}>
                <Button className={styles.filter_button}>
                    <Select
                        className={styles.hide_select}
                        sx={{
                            'padding': '0',
                            'boxShadow': '0',
                            '.MuiOutlinedInput-notchedOutline': {border: 0},
                            '.Mui-focused-notchedOutline': {border: 0},
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 0,
                            },
                        }}
                        inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-light)',
                                    },
                                },
                            },
                        }}
                        IconComponent={() => null}
                        value={sorttype}
                        onChange={(e) => setSorttype(e.target.value as string)}
                        label="Sorteer op"
                    >
                        {Object.entries(sorttypes).map(([option, value]) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                    <SortIcon/>
                </Button>

                <Button className={styles.filter_button}>
                    <Select
                        className={styles.hide_select}
                        sx={{
                            'padding': '0',
                            'boxShadow': '0',
                            '.MuiOutlinedInput-notchedOutline': {border: 0},
                            '.Mui-focused-notchedOutline': {border: 0},
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 0,
                            },
                        }}
                        inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-light)',
                                    },
                                },
                            },
                        }}
                        IconComponent={() => null}
                        displayEmpty={true}
                        multiple
                        value={selectedRegions}
                        onChange={handleChangeRegion}
                        renderValue={() => <p className={styles.collapse_text} style={{width: '40px'}}>regio</p>}
                    >
                        <MenuItem
                            key={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')}
                            value={'Alles'}>
                            <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelectedRegions} />
                            <ListItemText style ={{width: 150}}
                                primary={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')} />
                        </MenuItem>
                        {allRegions.map((option) => (
                            <MenuItem key={option.name} value={option as unknown as string}>
                                <Checkbox style ={{color: '#1C1C1C'}}
                                    checked={selectedRegions?.indexOf(option) > -1} />
                                <ListItemText primaryTypographyProps=
                                    {{style: {whiteSpace: 'normal', wordBreak: 'break-all'}}}
                                primary={option.name} />
                            </MenuItem>
                        ))}
                    </Select>
                    <FilterAltIcon/>
                </Button>
                <Button className={styles.filter_button}>
                    <Select
                        className={styles.hide_select}
                        sx={{
                            'padding': '0',
                            'boxShadow': '0',
                            '.MuiOutlinedInput-notchedOutline': {border: 0},
                            '.Mui-focused-notchedOutline': {border: 0},
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 0,
                            },
                        }}
                        inputProps={{
                            MenuProps: {
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: 'var(--secondary-light)',
                                    },
                                },
                            },
                        }}
                        IconComponent={() => null}
                        value={selectedUserType}
                        onChange={(e) => setSelectedUserType(e.target.value as string)}
                        label="Sorteer op"
                        renderValue={() =>
                            <p className={styles.collapse_text} style={{width: '40px'}}>
                                {(selectedUserType !== '') ? selectedUserType : 'alles'}
                            </p>}
                    >
                        <MenuItem key={'alles'} value={''}
                            style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                            {'Alle'}
                        </MenuItem>
                        {Object.entries(userTypes).map(([option, value]) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                    <Person/>
                </Button>
            </div>

            <Button className={styles.insert_button} onMouseUp={handleToggle}>
                <AddIcon style={{margin: '0px'}}/>
                <p className={styles.collapse_text}>gebruiker toevoegen</p>
            </Button>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                invisible={false}
            >
                <Form open={open} setCanClose={setCanClose} canClose={canClose} setOpen={setOpen}
                    allBuildings={allBuildings} allRegions={allRegions}></Form>
            </Backdrop>
        </div>


    );
}
