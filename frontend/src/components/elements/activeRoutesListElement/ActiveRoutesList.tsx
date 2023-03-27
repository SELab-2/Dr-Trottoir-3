import React, {useEffect, useState} from "react";
import styles from "@/styles/ListView.module.css";
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
    SelectChangeEvent, TextField,
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import {ClickAwayListener} from "@mui/base";
import {CheckBox} from "@mui/icons-material";

interface LiveRoute {
    id: number
    naam: string,
    regio: string,
    distance: string,
    completion: number
}

const dummyRoutes:LiveRoute[] = [
    {id: 7, naam: "Bavo", regio: "Gent", distance: "10km", completion: 0.10},
    {id: 1, naam: "Lander", regio: "Antwerpen", distance: "17km", completion: 0.55},
    {id: 2, naam: "Jef", regio: "Gent", distance: "8km", completion: 0.90},
    {id: 3, naam: "Maxim", regio: "Gent", distance: "69km", completion: 0.50},
    {id: 4, naam: "Pim", regio: "Antwerpen", distance: "42km", completion: 1},
    {id: 5, naam: "Joris", regio: "Gent", distance: "25km", completion: 0.75},
    {id: 6, naam: "Jahid", regio: "Gent", distance: "13km", completion: 0.33},
    {id: 0, naam: "route 2", regio: "Antwerpen", distance: "11km", completion: 0.66},
    {id: 8, naam: "route 3", regio: "Gent", distance: "42km", completion: 0.89},
    {id: 9, naam: "route 1", regio: "Gent", distance: "23km", completion: 1},
    {id: 10, naam: "centrum", regio: "Antwerpen", distance: "42km", completion: 0.5},
    {id: 11, naam: "zuid", regio: "Gent", distance: "7km", completion: 0.5},
]


export default function ActiveRoutesList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam")
    const [region, setRegion] = React.useState("")

    const sortedRoutes = dummyRoutes.sort(function(first, second) {
        return (first[sorttype as keyof LiveRoute] as string).localeCompare(second[sorttype as keyof LiveRoute] as string);})
    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if(element != null){
            element.scrollTo({top: 0, behavior: 'smooth'})
        }
    }, [sorttype,region]);
    return (
        <>
            <div className={styles.full_outer}>

                <TopBar sorttype={sorttype} setSorttype={setSorttype} region={region} setRegion={setRegion}></TopBar>
                <div className={styles.under_columns}>
                    <div className={styles.list_wrapper}>
                        <div className={styles.list_bar} id={styles.scroll_style}>
                            {sortedRoutes.map(x => <ListItem
                                id={x.id} current={current} naam={x.naam} distance={x.distance} regio={x.regio} completion={x.completion} onClick={setCurrent} />)}
                        </div>
                    </div>
                </div>
            </div><script type="text/javascript">
            window.scrollTo(0)
            document.getElementById(styles.scroll_style).scrollTop=50
        </script>
        </>
    );
}


type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>
    region: string,
    setRegion: React.Dispatch<React.SetStateAction<string>>
}

function TopBar({sorttype, setSorttype, region, setRegion}:TopBarProps){
    const dummyRegions = [
        'Gent',
        'Antwerpen',
        'Brussel',
    ];


    const dummyTypes = [
        "actief",
        "compleet"
    ]

    const handleChangeRegion = (event: SelectChangeEvent) => {
        setRegion(event.target.value as string);
    };

    const sorttypes = [
        "naam",
        'regio',
        'distance'
    ];

    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const [searchEntry, setSearchEntry] = React.useState("")

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };

    const [active, setActive] = React.useState("");

    const handleChangeActive = (event: SelectChangeEvent) => {
        setActive(event.target.value as string);
    }


    return (
        <div  className={styles.topBar}>
            <div className={styles.title}>
                <h1>Actieve Routes</h1>
                <p>{dummyRoutes.length} gevonden resultaten</p>
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
            <div className={styles.generic_wrapper}>
                <div className={styles.filter_wrapper}>
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
                            <InputLabel>regio</InputLabel>
                            <Select
                                value={region}
                                onChange={handleChangeRegion}
                                label="Regio"
                            >
                                <MenuItem value="">
                                    <em>Alle</em>
                                </MenuItem>
                                {dummyRegions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className={styles.filters}>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
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
                                    <MenuItem key={option} value={option}>
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


type ListItemProps = {
    id: number,
    current: number | null,
    naam: string,
    distance: string,
    regio: string,
    completion: number,
    onClick: React.Dispatch<React.SetStateAction<number|null>>
}

const ListItem = ({id, current, naam, distance, regio, completion, onClick}: ListItemProps) => {
    const isCurrent = id == current
    return (

            <div className={styles.button_wrapper}>
                <Button id={(isCurrent)?styles.item_button_select : styles.item_button}
                        className={styles.button_default}
                        onClick={()=>onClick(id)}>
                    <div className={styles.listItemTextWrapper}>
                        <div className={styles.listItemLeftSide}>
                            <div className={styles.big_item_text}>
                                {naam}
                            </div>
                            <div className={styles.small_item_text}>
                                {regio}
                            </div>
                            <div className={styles.small_item_text}>
                                {distance}
                            </div>
                        </div>
                        <div className={styles.listItemRightSide}>
                            <div className={styles.very_big_item_text}>
                                {conditionalCheckmark(completion === 1)}
                                {Math.round(completion*100)}%
                            </div>
                        </div>
                    </div>
                </Button>
            </div>
    );
};

const conditionalCheckmark = (checkmark: boolean) => {
    if (checkmark){
        return (
            <CheckBox></CheckBox>
        );
    }
}
