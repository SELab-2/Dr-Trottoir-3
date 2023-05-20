import {
    Backdrop,
    Button, Checkbox,
    IconButton, InputBase, ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import {LocationGroup, User} from '@/api/models';
import React from 'react';
import styles from './topBar.module.css';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AddIcon from '@mui/icons-material/Add';
import Form from '../InsertFormElements/BuildingInsertFormComponent';
import {Clear} from '@mui/icons-material';


type TopBarProps = {
    onAdd: () => void,
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>,
    selectedRegions: LocationGroup[],
    setRegion: React.Dispatch<React.SetStateAction<LocationGroup[]>>,
    allRegions: LocationGroup[],
    amountOfResults: number,
    searchEntry: string,
    setSearchEntry: React.Dispatch<React.SetStateAction<string>>,
    handleSearch: (b: boolean) => void,
    allSyndici: User[],
};

export default function BuildingTopBarComponent({onAdd, sorttype, setSorttype, selectedRegions, setRegion, allRegions,
    searchEntry, setSearchEntry, handleSearch, allSyndici}:TopBarProps) {
    const AllesSelected = selectedRegions.length >= allRegions.length;

    const handleChangeRegion = (event: SelectChangeEvent<LocationGroup[]>) => {
        const value = event.target.value as LocationGroup[];

        setRegion(
            // value contains both string and LocationGroup, but I have no idea how
            // or why so I'm keeping this here for now
            // @ts-ignore
            (value.indexOf('Alles') > -1)?
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
                        displayEmpty={true}
                        onChange={(e) => setSorttype(e.target.value as string)}
                        label="Sorteer op"
                    >
                        {Object.entries(sorttypes).map(([option, value]) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                <p>{value}</p>
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
                        <MenuItem key={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} value={'Alles'}>
                            <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelected} />
                            <ListItemText style ={{width: 150}}
                                primary={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} />
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
            </div>

            <Button className={styles.insert_button} onMouseUp={handleToggle}>
                <AddIcon style={{margin: '0px'}}/>
                <p className={styles.collapse_text}>gebouw toevoegen</p>
            </Button>

            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={open}
                invisible={false}
            >
                <Form onSubmit={onAdd} setCanClose={setCanClose} canClose={canClose} setOpen={setOpen} open={open}
                    allRegions={allRegions} allSyndici={allSyndici}></Form>
            </Backdrop>
        </div>
    );
}
