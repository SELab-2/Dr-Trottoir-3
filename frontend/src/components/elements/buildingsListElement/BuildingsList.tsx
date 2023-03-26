import React, {useState} from "react";
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
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';

interface Building {
    id: number
    naam: string,
    adres: string,
    regio: string
}

const dummyBuildings:Building[] = [
    {id: 7, naam: "Bavo", adres: "Radijsweg 93", regio: "Gent"},
    {id: 1, naam: "Lander", adres: "Pompoenstraat 6", regio: "Antwerpen"},
    {id: 2, naam: "Jef", adres: "Paprikalaan 7", regio: "Gent"},
    {id: 3, naam: "Maxim", adres: "Komkommerlaan 69", regio: "Gent"},
    {id: 4, naam: "Pim", adres: "Wortelsesteenweg 42", regio: "Antwerpen"},
    {id: 5, naam: "Joris", adres: "Tomaatstraat 21", regio: "Gent"},
    {id: 6, naam: "Jahid", adres: "Bonenwegel 69", regio: "Gent"},
    {id: 0, naam: "building 2", adres: "Courgettelaan 42", regio: "Antwerpen"},
    {id: 8, naam: "building 3", adres: "Slastraat 21", regio: "Gent"},
    {id: 9, naam: "building 1", adres: "Spinaziewegel 69", regio: "Gent"},
    {id: 10, naam: "Upkot SintPieters", adres: "Bloemkoolsesteenweg 42", regio: "Antwerpen"},
    {id: 11, naam: "Jail", adres: "Ajuinwegel 21", regio: "Gent"},
]


export default function BuildingsList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam")

    const sortedBuildings = dummyBuildings.sort(function(first, second) {
        return (first[sorttype as keyof Building] as string).localeCompare(second[sorttype as keyof Building] as string);})

    return (
        <div className={styles.full_outer}>

            <TopBar sorttype={sorttype} setSorttype={setSorttype}></TopBar>
            <div className={styles.under_columns}>
                <div className={styles.list_wrapper}>
                    <div className={styles.list_bar} id={styles.scroll_style}>
                        {sortedBuildings.map(x => <ListItem
                            id={x.id} current={current} naam={x.naam} adres={x.adres} regio={x.regio} onClick={setCurrent} />)}
                    </div>
                </div>
            </div>

        </div>
    );
}

type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>
}

function TopBar({sorttype, setSorttype}:TopBarProps){
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


    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const [searchEntry, setSearchEntry] = React.useState("")

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };

    return (
        <div  className={styles.topBar}>
            <div className={styles.title}>
                <h1>Gebouwen</h1>
                <p>{dummyBuildings.length} gebouwen gevonden</p>
            </div>

            <div className={styles.search}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ p: '5px'}}
                        autoComplete={"true"}
                        fullWidth={true}
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
    id: number,
    current: number | null,
    naam: string,
    adres: string,
    regio: string
    onClick: React.Dispatch<React.SetStateAction<number|null>>
}

const ListItem = ({id, current, naam, adres, regio, onClick}: ListItemProps) => {
    const isCurrent = id == current
    return (
        <div className={styles.button_wrapper}>
            <Button id={(isCurrent)?styles.item_button_select : styles.item_button}
                    className={styles.button_default}
                    onClick={()=>onClick(id)}>
                <div className={styles.big_item_text}>
                    {naam}
                </div>
                <div className={styles.small_item_text}>
                    {adres}
                </div>
                <div className={styles.small_item_text}>
                    {regio}
                </div>
            </Button>
        </div>
    );
};
