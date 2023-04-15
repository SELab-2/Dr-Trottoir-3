import React from 'react';
import {
    Checkbox,
    FormControl,
    IconButton,
    InputBase,
    InputLabel, ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import styles from '@/styles/listView.module.css';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {LocationGroup} from '@/api/models';

type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>
    selectedRegions: LocationGroup[],
    setSelectedRegions: React.Dispatch<React.SetStateAction<LocationGroup[]>>,
    allRegions: LocationGroup[],
    amountOfResults: number,
    searchEntry: string,
    setSearchEntry: React.Dispatch<React.SetStateAction<string>>,
}

export default function LiveRouteTopBarComponent(
    {sorttype, setSorttype, selectedRegions, setSelectedRegions, allRegions,
        searchEntry, setSearchEntry}:TopBarProps) {
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

    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };

    const [active, setActive] = React.useState('');

    const handleChangeActive = (event: SelectChangeEvent) => {
        setActive(event.target.value as string);
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
                                style={{width: 150}}
                                IconComponent={() => (
                                    <SortIcon/>
                                )}
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
                                <MenuItem key={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')}
                                    value={'Alles'}>
                                    <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelectedRegions} />
                                    <ListItemText style ={{width: 150}}
                                        primary={'Alles '+((AllesSelectedRegions)?'deselecteren':'selecteren')} />
                                </MenuItem>
                                {allRegions.map((option) => (
                                    <MenuItem key={option.id} value={option}>
                                        <Checkbox style ={{color: '#1C1C1C'}}
                                            checked={selectedRegions.indexOf(option) > -1} />
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
                            <InputLabel>status</InputLabel>
                            <Select
                                value={active}
                                onChange={handleChangeActive}
                                label="Type"
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
                        </FormControl>
                    </div>
                </div>
            </div>
        </div>


    );
}
