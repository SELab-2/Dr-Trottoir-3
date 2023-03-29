import {
    Backdrop,
    Button, Checkbox,
    FormControl,
    IconButton,
    InputBase,
    InputLabel,
    ListItemText,
    MenuItem,
    Select, SelectChangeEvent,
} from '@mui/material';
import React from 'react';
import styles from './TopBar.module.css';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';


type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>,
    region: string[],
    setRegion: React.Dispatch<React.SetStateAction<string[]>>,
    regions: any[],
}

export default function BuildingTopBarComponent({sorttype, setSorttype, region, setRegion, regions}:TopBarProps) {
    const AllesSelected = regions.length>=regions.length;

    const handleChangeRegion = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setRegion(
            (value.indexOf('Alles')>-1)?
                (AllesSelected)?
                    []:
                    regions:
                value );
    };

    const sorttypes = [
        'naam',
        'adres',
        'regio',
    ];

    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const [searchEntry, setSearchEntry] = React.useState('');

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
                                style={{width: 150}}
                                IconComponent={() => (
                                    <SortIcon/>
                                )}
                                value={sorttype}
                                onChange={handleChangeSorttype}
                                label="Sorteer op"
                            >
                                {sorttypes.map((option) => (
                                    <MenuItem key={option} value={option} style={{wordBreak: 'break-all', whiteSpace: 'normal'}}>
                                        {option}
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
                                value={region}
                                onChange={handleChangeRegion}
                                renderValue={() => 'regio'}
                            >
                                <MenuItem key={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} value={'Alles'}>
                                    <Checkbox style ={{color: '#1C1C1C'}} checked={AllesSelected} />
                                    <ListItemText style ={{width: 150}} primary={'Alles '+((AllesSelected)?'deselecteren':'selecteren')} />
                                </MenuItem>
                                {regions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox style ={{color: '#1C1C1C'}} checked={region.indexOf(option) > -1} />
                                        <ListItemText primaryTypographyProps={{style: {whiteSpace: 'normal', wordBreak: 'break-all'}}} primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                </div>
                <Button variant="contained" className={styles.button} onMouseUp={handleToggle}>
                    <AddIcon />
                    Gebouw Toevoegen
                </Button>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={open}
                    invisible={false}
                >
                    LOAD FORM
                </Backdrop>
            </div>
        </div>
    );
}


