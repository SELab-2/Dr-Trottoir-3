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
import {LocationGroup} from '@/api/models';
import React from 'react';
import styles from './topBar.module.css';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import Form from '../InsertFormElements/BuildingInsertFormComponent';


type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>,
    selectedRegions: LocationGroup[],
    setRegion: React.Dispatch<React.SetStateAction<LocationGroup[]>>,
    allRegions: LocationGroup[],
    amountOfResults: number,
    searchEntry: string,
    setSearchEntry: React.Dispatch<React.SetStateAction<string>>,
};

export default function BuildingTopBarComponent({sorttype, setSorttype, selectedRegions, setRegion, allRegions,
    searchEntry, setSearchEntry}:TopBarProps) {
    const AllesSelected = selectedRegions.length>=allRegions.length;

    const handleChangeRegion = (event: SelectChangeEvent<LocationGroup[]>) => {
        const value = event.target.value as LocationGroup[];

        setRegion(
            (value.indexOf('Alles')>-1)?
                (AllesSelected)?
                    []:
                    allRegions:
                value );
    };

    const sorttypes = {
        name: 'naam',
        address: 'adres',
        location_group__name: 'regio',
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
            <div className={styles.search_container}>
                <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{p: '5px'}}
                    size={''}
                    autoComplete={'true'}
                    fullWidth={true}
                    placeholder="Zoek op naam"
                    value={searchEntry}
                    onChange={handleChangeSearchEntry}
                />
            </div>
            <div className={styles.filters_container}>
                <Button className={styles.filter_button}>
                    <Select
                        sx={{
                            'boxShadow': 'none',
                            '.MuiOutlinedInput-notchedOutline': {border: 0},
                            '.Mui-focused-notchedOutline': {border: 0},
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 0,
                            },
                        }}
                        IconComponent={() => (<SortIcon/>)}
                        value={sorttype}
                        onChange={handleChangeSorttype}
                        label="Sorteer op"
                    >
                        {Object.keys(sorttypes).map((option) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                {sorttypes[option]}
                            </MenuItem>
                        ))}
                    </Select>
                </Button>
                <Button className={styles.filter_button}>
                    <Select
                        sx={{
                            'boxShadow': 'none',
                            '.MuiOutlinedInput-notchedOutline': {border: 0},
                            '.Mui-focused-notchedOutline': {border: 0},
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 0,
                            },
                        }}
                        displayEmpty={true}
                        multiple
                        value={selectedRegions}
                        onChange={handleChangeRegion}
                        renderValue={() => 'regio'}
                    >
                        <MenuItem key={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} value={'Alles'}>
                            <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelected} />
                            <ListItemText style ={{width: 150}}
                                primary={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} />
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
                </Button>
            </div>

            <Button className={styles.insert_button} onMouseUp={handleToggle}>
                <AddIcon style={{margin: '0px'}}/>
                <p className={styles.collapse_text}>Gebouw Toevoegen</p>
            </Button>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                invisible={false}
            >
                <Form setCanClose={setCanClose} canClose={canClose} setOpen={setOpen}
                    allRegions={allRegions}></Form>
            </Backdrop>
        </div>
    );
}
