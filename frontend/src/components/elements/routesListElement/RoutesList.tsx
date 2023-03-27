import React, {useEffect, useState} from "react";
import styles from "@/styles/ListView.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import {
    Backdrop,
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
import AddIcon from '@mui/icons-material/Add';
import {ClickAwayListener} from "@mui/base";

interface Route {
    id: number
    naam: string,
    regio: string,
    distance: string
}

const dummyRoutes:Route[] = [
    {id: 7, naam: "Bavo", regio: "Gent", distance: "10km"},
    {id: 1, naam: "Lander", regio: "Antwerpen", distance: "17km"},
    {id: 2, naam: "Jef", regio: "Gent", distance: "8km"},
    {id: 3, naam: "Maxim", regio: "Gent", distance: "69km"},
    {id: 4, naam: "Pim", regio: "Antwerpen", distance: "42km"},
    {id: 5, naam: "Joris", regio: "Gent", distance: "25km"},
    {id: 6, naam: "Jahid", regio: "Gent", distance: "13km"},
    {id: 0, naam: "route 2", regio: "Antwerpen", distance: "11km"},
    {id: 8, naam: "route 3", regio: "Gent", distance: "42km"},
    {id: 9, naam: "route 1", regio: "Gent", distance: "23km"},
    {id: 10, naam: "centrum", regio: "Antwerpen", distance: "42km"},
    {id: 11, naam: "zuid", regio: "Gent", distance: "7km"},
]


export default function RoutesList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam")
    const [region, setRegion] = React.useState("")

    const sortedRoutes = dummyRoutes.sort(function(first, second) {
        return (first[sorttype as keyof Route] as string).localeCompare(second[sorttype as keyof Route] as string);})
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
                                id={x.id} current={current} naam={x.naam} distance={x.distance} regio={x.regio} onClick={setCurrent} />)}
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
        "niet actief"
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

    const [open, setOpen] = React.useState(false);

    const [canClose, setCanClose] = React.useState(true);
    const handleClose = () => {
        if (canClose){
            setOpen(false);
        }

    };
    const handleToggle = () => {
        setCanClose(false);
        setOpen(!open);
    };

    const handleSubmitForm = () =>{

    }

    const [formName, setFormName] = React.useState("")
    const handleChangeFormName = (event: SelectChangeEvent) => {
        setFormName(event.target.value as string);
    };


    const [formRegion, setFormRegion] = React.useState("")
    const handleChangeFormRegion = (event: SelectChangeEvent) => {
        setFormRegion(event.target.value as string);
    };

    const Form = ()=>{

        React.useEffect(() =>{
            setCanClose(true)
        });
        return(
            <ClickAwayListener onClickAway={handleClose}>
                <div className={styles.formCenter}>
                    <div className={styles.form}>
                        <h2 style={{color:"black"}}>Route Toevoegen</h2>
                        <div className={styles.formFields}>
                            <div className={styles.field}>
                                <TextField
                                    required
                                    label="naam"
                                    value={formName}
                                    onChange={handleChangeFormName}
                                />
                            </div>
                            <FormControl sx={{minWidth: 150 }}>
                                <InputLabel>regio</InputLabel>
                                <Select
                                    value={formRegion}
                                    onChange={handleChangeFormRegion}
                                    label="regio"
                                    defaultValue=""
                                    MenuProps={{ disablePortal: true }}
                                >
                                    {dummyRegions.map((option) => (
                                        <MenuItem id="menuitem" key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={styles.formButtons}>
                            <Button variant="contained" className={styles.button} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button variant="contained" className={styles.button} onClick={handleSubmitForm}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        )
    }

    return (
        <div  className={styles.topBar}>
            <div className={styles.title}>
                <h1>Routes</h1>
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
                            <InputLabel>type</InputLabel>
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
                <Button variant="contained" className={styles.button} onMouseUp={handleToggle}>
                    <AddIcon />
                    Route toevoegen
                </Button>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    invisible={false}
                >
                    {Form()}
                </Backdrop>
            </div>
        </div>


    );
}


type ListItemProps = {
    id: number,
    current: number | null,
    naam: string,
    distance: string,
    regio: string
    onClick: React.Dispatch<React.SetStateAction<number|null>>
}

const ListItem = ({id, current, naam, distance, regio, onClick}: ListItemProps) => {
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
                    {regio}
                </div>
                <div className={styles.small_item_text}>
                    {distance}
                </div>
            </Button>
        </div>
    );
};
