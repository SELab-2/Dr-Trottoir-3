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
import styles from './topBar.module.css';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {LocationGroup, ScheduleDefinition} from '@/api/models';
import Form from '../InsertFormElements/RoutesInsertFormComponent';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import {Clear} from '@mui/icons-material';

type TopBarProps = {
    onAdd: () => void,
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>
    selectedRegions: LocationGroup[],
    setRegion: React.Dispatch<React.SetStateAction<LocationGroup[]>>,
    allRegions: LocationGroup[],
    amountOfResults: number,
    searchEntry: string,
    setSearchEntry: React.Dispatch<React.SetStateAction<string>>,
    selectedActive: string,
    setSelectedActive: React.Dispatch<React.SetStateAction<string>>,
    allRoutes: ScheduleDefinition[],
    handleSearch: (b: boolean) => void,
};

export default function RouteTopBarComponent({onAdd, sorttype, setSorttype, selectedRegions, setRegion, allRegions,
    searchEntry, setSearchEntry, selectedActive, setSelectedActive, allRoutes, handleSearch}:TopBarProps) {
    const AllesSelected = selectedRegions.length>=allRegions.length;

    const handleChangeRegion = (event: SelectChangeEvent<LocationGroup[]>) => {
        const value = event.target.value as LocationGroup[];
        setRegion(
            // @ts-ignore
            (value.indexOf('Alles') > -1)?
                (AllesSelected)?
                    []:
                    allRegions:
                value );
    };

    const newestOnly = {
        all: 'Alle',
        newest: 'Actief',
    };

    const sorttypes = {
        name: 'Naam',
        location_group__name: 'Regio',
        // buildings: 'aantal gebouwen',
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
                        style={{fontSize: '14px'}}
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
                        renderValue={() => <p className={styles.collapse_text} style={{width: '40px'}}>Regio</p>}
                    >
                        <MenuItem key={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} value={'Alles'}>
                            <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelected} />
                            <ListItemText style ={{width: 150}}
                                primary={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} />
                        </MenuItem>
                        {allRegions.map((option) => (
                            <MenuItem key={option.name} value={option as unknown as string}>
                                <Checkbox style ={{color: '#1C1C1C'}}
                                    checked={selectedRegions.indexOf(option) > -1} />
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
                        style={{fontSize: '14px'}}
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
                        value={selectedActive}
                        onChange={(e) => setSelectedActive(e.target.value as string)}
                        label="Type"
                        // renderValue={() => <p className={styles.collapse_text} style={{width: '40px'}}>
                        //     {selectedActive.toString() === 'true' ? 'Actief' : 'Alle'}
                        // </p>}
                    >
                        {Object.entries(newestOnly).map(([option, value]) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                    <SensorsRoundedIcon/>
                </Button>
            </div>
            <Button className={styles.insert_button} onMouseUp={handleToggle}>
                <AddIcon style={{margin: '0px'}}/>
                <p className={styles.collapse_text}>Route toevoegen</p>
            </Button>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                invisible={false}
            >
                <Form open={open} onSubmit={onAdd} setCanClose={setCanClose} canClose={canClose} setOpen={setOpen}
                    allRegions={allRegions} allRoutes={allRoutes}></Form>
            </Backdrop>
        </div>
    );
}
