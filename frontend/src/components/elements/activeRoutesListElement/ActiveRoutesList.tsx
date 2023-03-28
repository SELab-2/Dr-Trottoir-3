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
    SelectChangeEvent,
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import CheckIcon from '@mui/icons-material/Check';

interface LiveRoute {
    id: number
    naam: string,
    regio: string,
    distance: string,
    completion: number,
    student: string,
}

const dummyRoutes:LiveRoute[] = [
    {id: 7, naam: "aardappel", regio: "Gent", distance: "10km", completion: 0.10, student: "Bavo"},
    {id: 1, naam: "water", regio: "Antwerpen", distance: "17km", completion: 0.55, student: "Jef"},
    {id: 2, naam: "aardpeer", regio: "Gent", distance: "8km", completion: 0.90, student: "Maxim"},
    {id: 3, naam: "courgette", regio: "Gent", distance: "69km", completion: 0.50, student: "Jahid"},
    {id: 4, naam: "wortel", regio: "Antwerpen", distance: "42km", completion: 1, student: "Pim"},
    {id: 5, naam: "tomaat", regio: "Gent", distance: "25km", completion: 0.75, student: "Joris"},
    {id: 6, naam: "aardappelsalade", regio: "Gent", distance: "13km", completion: 0.33, student: "Obama"},
    {id: 0, naam: "route 2", regio: "Antwerpen", distance: "11km", completion: 0.66, student: "Dababy"},
    {id: 8, naam: "route 3", regio: "Gent", distance: "42km", completion: 0.89, student: "Kanye"},
    {id: 9, naam: "route 1", regio: "Gent", distance: "23km", completion: 1, student: "Big Ounce"},
    {id: 10, naam: "centrum", regio: "Antwerpen", distance: "42km", completion: 0.5, student: "Babo"},
    {id: 11, naam: "zuid", regio: "Gent", distance: "7km", completion: 0.5, student: "Cringe"},
]


export default function ActiveRoutesList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam")
    const [region, setRegion] = React.useState("")

    const sortedRoutes = dummyRoutes.sort(function(first, second) {
        const value = first[sorttype as keyof LiveRoute];
        if(typeof value == "number"){
            return value-(second[sorttype as keyof LiveRoute] as number);
        }
        return value.localeCompare(second[sorttype as keyof LiveRoute] as string);
    })
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
            </div>
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
        'distance',
        "student",
        "completion",
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
                                    <MenuItem key={option} value={option} style={{wordBreak: "break-all",whiteSpace: 'normal',}}>
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
                                    <MenuItem key={option} value={option} style={{wordBreak: "break-all",whiteSpace: 'normal',}}>
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
                                    <MenuItem key={option} value={option}  style={{wordBreak: "break-all",whiteSpace: 'normal',}}>
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
                            {conditionalCheckmark(completion === 1)}
                            <div className={styles.very_big_item_text}>
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
            <CheckIcon></CheckIcon>
        );
    }
}
