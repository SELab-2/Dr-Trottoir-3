import React from 'react';
import {
    Checkbox,
    IconButton,
    InputBase,
    ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import styles from './topBar.module.css';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {LocationGroup} from '@/api/models';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import {Clear} from '@mui/icons-material';

type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>
    selectedRegions: LocationGroup[],
    setSelectedRegions: React.Dispatch<React.SetStateAction<LocationGroup[]>>,
    allRegions: LocationGroup[],
    amountOfResults: number,
    searchEntry: string,
    setSearchEntry: React.Dispatch<React.SetStateAction<string>>,
    handleSearch: (b: boolean) => void,
}

export default function LiveRouteTopBarComponent(
    {sorttype, setSorttype, selectedRegions, setSelectedRegions, allRegions,
        searchEntry, setSearchEntry, handleSearch}:TopBarProps) {
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

    const dummyTypes = [
        'actief',
        'compleet',
    ];

    const sorttypes = {
        schedule_definition__name: 'naam',
        schedule_definition__location_group__name: 'regio',
        schedule_definition__student__name: 'student',
        progress: 'voortgang',
    };

    const [active, setActive] = React.useState('');

    const handleChangeActive = (event: SelectChangeEvent) => {
        setActive(event.target.value as string);
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
                        <MenuItem key={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')}
                            value={'Alles'}>
                            <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelectedRegions} />
                            <ListItemText style ={{width: 150}}
                                primary={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')} />
                        </MenuItem>
                        {allRegions.map((option) => (
                            <MenuItem key={option.id} value={option as unknown as string}>
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
                        value={active}
                        onChange={handleChangeActive}
                        label="Type"
                        renderValue={() => <p className={styles.collapse_text} style={{width: '40px'}}>
                            {active}
                        </p>}
                    >
                        <MenuItem value="">
                            <em>Alle</em>
                        </MenuItem>
                        {dummyTypes.map((option) => (
                            <MenuItem key={option} value={option}
                                style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <SensorsRoundedIcon/>
                </Button>
            </div>
        </div>


    );
}
