import React, {useEffect, useState} from "react";
import styles from "@/styles/ListView.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import {
    Button, Checkbox,
    FormControl,
    IconButton,
    InputBase,
    InputLabel, ListItemText,
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
    afstand: number,
    voortgang: number,
    student: string,
}

const dummyRoutes:LiveRoute[] = [
    {id: 7, naam: "aardappel", regio: "Gent", afstand: 10000, voortgang: 0.10, student: "Bavo"},
    {id: 1, naam: "water", regio: "Antwerpen", afstand: 17000, voortgang: 0.55, student: "Jef"},
    {id: 2, naam: "aardpeer", regio: "Gent", afstand: 8000, voortgang: 0.90, student: "Maxim"},
    {id: 3, naam: "courgette", regio: "Gent", afstand: 69000, voortgang: 0.50, student: "Jahid"},
    {id: 4, naam: "wortel", regio: "Antwerpen", afstand: 42000, voortgang: 1, student: "Pim"},
    {id: 5, naam: "tomaat", regio: "Gent", afstand: 25000, voortgang: 0.75, student: "Joris"},
    {id: 6, naam: "aardappelsalade", regio: "Gent", afstand: 13000, voortgang: 0.33, student: "Obama"},
    {id: 0, naam: "route 2", regio: "Antwerpen", afstand: 11000, voortgang: 0.66, student: "Dababy"},
    {id: 8, naam: "route 3", regio: "Gent", afstand: 42000, voortgang: 0.89, student: "Kanye"},
    {id: 9, naam: "route 1", regio: "Gent", afstand: 23000, voortgang: 1, student: "Big Ounce"},
    {id: 10, naam: "centrum", regio: "Antwerpen", afstand: 42000, voortgang: 0.5, student: "Babo"},
    {id: 11, naam: "zuid", regio: "Gent", afstand: 7000, voortgang: 0.5, student: "Cringe"},
]

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];

export default function ActiveRoutesList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam")
    const [region, setRegion] = React.useState<string[]>(dummyRegions)

    const sortedRoutes = dummyRoutes.sort(function(first, second) {
        const value = first[sorttype as keyof LiveRoute];
        if(typeof value == "number"){
            return (second[sorttype as keyof LiveRoute] as number)-value;
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
                                id={x.id} current={current} naam={x.naam} afstand={x.afstand} regio={x.regio} voortgang={x.voortgang} onClick={setCurrent} />)}
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
    region: string[],
    setRegion: React.Dispatch<React.SetStateAction<string[]>>
}

function TopBar({sorttype, setSorttype, region, setRegion}:TopBarProps){
    const AllesSelected = region.length>=dummyRegions.length

    const handleChangeRegion = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setRegion(
            (value.indexOf("Alles")>-1)?
                (AllesSelected)?
                    []:
                    dummyRegions:
                value    );
      };

    const dummyTypes = [
        "actief",
        "compleet"
    ]

    const sorttypes = [
        "naam",
        'regio',
        'afstand',
        "student",
        "voortgang",
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
                                style={{width:150}}
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
                            <Select
                                displayEmpty={true}
                                multiple
                                value={region}
                                onChange={handleChangeRegion}
                                renderValue={() => "regio"}
                            >
                                <MenuItem key={"Alles "+((AllesSelected)?"deselecteren":"selecteren")} value={"Alles"}>
                                    <Checkbox style ={{color: "#1C1C1C",}} checked={AllesSelected} />
                                        <ListItemText style ={{width: 150, }} primary={"Alles "+((AllesSelected)?"deselecteren":"selecteren")} />
                                </MenuItem>
                                {dummyRegions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox style ={{color: "#1C1C1C",}} checked={region.indexOf(option) > -1} />
                                        <ListItemText primaryTypographyProps={{ style: { whiteSpace: "normal", wordBreak: "break-all" } }}  primary={option} />
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
    afstand: number,
    regio: string,
    voortgang: number,
    onClick: React.Dispatch<React.SetStateAction<number|null>>
}

const ListItem = ({id, current, naam, afstand, regio, voortgang, onClick}: ListItemProps) => {
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
                                {(Math.round(afstand/10))/100}km
                            </div>
                        </div>
                        <div className={styles.listItemRightSide}>
                            {conditionalCheckmark(voortgang === 1)}
                            <div className={styles.very_big_item_text}>
                                {Math.round(voortgang*100)}%
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
