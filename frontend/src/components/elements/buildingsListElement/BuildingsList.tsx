import React from "react";
import styles from "@/components/elements/buildingsListElement/BuildingsList.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import {
    Button,
    FormControl,
    IconButton,
    InputBase,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';



const dummyBuildings = [
    {name: "building 1", adress: "building 1 street 69", locationGroup: "Gent"},
    {name: "building 2", adress: "building 2 street 42", locationGroup: "Antwerpen"},
    {name: "building 3", adress: "building 3 lane 21", locationGroup: "Gent"},
    {name: "building 1", adress: "building 1 street 69", locationGroup: "Gent"},
    {name: "building 2", adress: "building 2 street 42", locationGroup: "Antwerpen"},
    {name: "building 3", adress: "building 3 lane 21", locationGroup: "Gent"},
    {name: "building 1", adress: "building 1 street 69", locationGroup: "Gent"},
    {name: "building 2", adress: "building 2 street 42", locationGroup: "Antwerpen"},
    {name: "building 3", adress: "building 3 lane 21", locationGroup: "Gent"},
    {name: "building 1", adress: "building 1 street 69", locationGroup: "Gent"},
    {name: "building 2", adress: "building 2 street 42", locationGroup: "Antwerpen"},
    {name: "building 3", adress: "building 3 lane 21", locationGroup: "Gent"},
]


export default function BuildingsList() {
    return (
        <div className={styles.full_outer}>

            <TopBar></TopBar>
            <div className={styles.under_columns}>
                <div className={styles.list_bar} id={styles.scroll_style}>
                    {dummyBuildings.map(x => <ListItem name={x.name} adress={x.adress} locationGroup={x.locationGroup} />)}
                </div>
            </div>

        </div>
    );
}

function TopBar(){
    const regions = [
        'Gent',
        'Antwerpen',
        'Brussel',
    ];

    const [region, setRegion] = React.useState("")
    const handleChangeRegion = (event: SelectChangeEvent) => {
        setRegion(event.target.value as string);
    };

    const sorttypes = [
        "naam",
        'adres',
        'regio'
    ];

    const [sorttype, setSorttype] = React.useState("naam")

    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const [searchEntry, setSearchEntry] = React.useState("")

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };

    return (
        <div  id={styles.topBar}>
            <div id={styles.title}>
                <h1>Gebouwen</h1>
                <p>{dummyBuildings.length} gebouwen gevonden</p>
            </div>

            <div id={styles.search}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ p: '5px'}}
                        autoComplete={"true"}
                        placeholder="Zoek op naam"
                        value={searchEntry}
                        onChange={handleChangeSearchEntry}
                    />
                </Box>
            </div>

            <div className={styles.filters}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Sorteer op</InputLabel>
                    <Select
                        IconComponent={() => (
                            <SortIcon/>
                        )}
                        value={sorttype}
                        onChange={handleChangeSorttype}
                        label="Sorteer op"
                    >
                        {sorttypes.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className={styles.filters}>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel>Regio</InputLabel>
                    <Select
                        value={region}
                        onChange={handleChangeRegion}
                        label="Regio"
                    >
                        <MenuItem value="">
                            <em>Alle</em>
                        </MenuItem>
                        {regions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <Button variant="contained" className={styles.button}>
                <AddIcon />
                Gebouw Toevoegen

            </Button>
        </div>

    );
}

type ListItemProps = {
    name: string,
    adress: string,
    locationGroup: string
}

const ListItem = ({name, adress, locationGroup}: ListItemProps) => {
    return (
        <Button id={styles.item_button} className={styles.button_default}>
            <div className={styles.big_item_text}>
                {name}
            </div>
            <div className={styles.small_item_text}>
                {adress}
            </div>
            <div className={styles.small_item_text}>
                {locationGroup}
            </div>
        </Button>
    );
};
