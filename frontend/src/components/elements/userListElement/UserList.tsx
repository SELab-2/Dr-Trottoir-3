import React, {useEffect, useState} from "react";
import styles from "@/styles/ListView.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import {
    Backdrop,
    Button, Checkbox,
    FormControl,
    IconButton,
    InputBase,
    InputLabel, ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent, TextField,
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import {ClickAwayListener} from "@mui/base";

interface User {
    id: number
    voornaam: string,
    achternaam: string,
    "uren gewerkt": number,
    type: string,
    regio: string
}


const dummyUsers:User[] = [
    {id: 7, voornaam: "Bavo", achternaam:"Verstraeten", "uren gewerkt":15, type: "student", regio: "Gent"},
    {id: 1, voornaam: "Lander", achternaam:"Durie", "uren gewerkt":30, type: "superstudent", regio: "Antwerpen"},
    {id: 2, voornaam: "Jef", achternaam:"Roosens", "uren gewerkt":6, type: "admin", regio: "Gent"},
    {id: 3, voornaam: "Maxim", achternaam:"Stockmans", "uren gewerkt":45, type: "syndicus", regio: "Gent"},
    {id: 4, voornaam: "Pim", achternaam:"Pieters", "uren gewerkt":15, type: "syndicus", regio: "Antwerpen"},
    {id: 5, voornaam: "Joris", achternaam:"Peeters", "uren gewerkt":6, type: "student", regio: "Gent"},
    {id: 6, voornaam: "Jahid", achternaam:"Chetti", "uren gewerkt":15, type: "student", regio: "Gent"},
    {id: 0, voornaam: "persoon 2", achternaam:"Foo", "uren gewerkt":2, type: "admin", regio: "Antwerpen"},
    {id: 8, voornaam: "persoon 3", achternaam:"Bar", "uren gewerkt":3, type: "syndicus", regio: "Gent"},
    {id: 9, voornaam: "persoon 1", achternaam:"Baz", "uren gewerkt":1, type: "superstudent", regio: "Gent"},
    {id: 10, voornaam: "Donald", achternaam:"Trump", "uren gewerkt":99, type: "superstudent", regio: "Antwerpen"},
    {id: 11, voornaam: "Joe", achternaam:"Biden", "uren gewerkt":1, type: "superstudent", regio: "Gent"},
]

const dummyType = [
    "student",
    "superstudent",
    "admin",
    "syndicus",
];

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];

export default function UsersList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("voornaam");
    const [region, setRegion] = React.useState<string[]>(dummyRegions);
    const [type, setType] = React.useState<string[]>(dummyType);
    const sortedUsers = dummyUsers.sort(function(first, second) {
        const value = first[sorttype as keyof User]
        if(typeof value == "number"){
            return value-(second[sorttype as keyof User] as number);
        }
        return value.localeCompare(second[sorttype as keyof User] as string);})
    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if(element != null){
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
      }, [sorttype,region]);
    return (
        <>
            <div className={styles.full_outer}>

                <TopBar sorttype={sorttype} setSorttype={setSorttype} region={region} setRegion={setRegion} type={type} setType={setType}></TopBar>
            <div className={styles.under_columns}>
                <div className={styles.list_wrapper}>
                    <div className={styles.list_bar} id={styles.scroll_style}>
                        {sortedUsers.map(x => <ListItem
                            id={x.id} current={current} naam={x.voornaam+' .'+x.achternaam[0]} type={x.type} regio={x.regio} onClick={setCurrent} />)}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}


type TopBarProps = {
    sorttype: string,
    setSorttype: React.Dispatch<React.SetStateAction<string>>,
    region: string[],
    setRegion: React.Dispatch<React.SetStateAction<string[]>>,
    type: string[],
    setType: React.Dispatch<React.SetStateAction<string[]>>,
}

function TopBar({sorttype, setSorttype, region, setRegion, type, setType}:TopBarProps){
    const RegionAllesSelected = region.length>=dummyRegions.length

    const handleChangeRegion = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setRegion(
            (value.indexOf("Alles")>-1)?
                (RegionAllesSelected)?
                    []:
                    dummyRegions:
                value    );
      };

    const TypeAllesSelected = type.length>=dummyType.length

    const handleChangeType = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value as string[];
        setType(
            (value.indexOf("Alles")>-1)?
                (TypeAllesSelected)?
                    []:
                    dummyType:
                value    );
      };

    const sorttypes = [
        "voornaam",
        'achternaam',
        'uren gewerkt',
    ];


    const handleChangeSorttype = (event: SelectChangeEvent) => {
        setSorttype(event.target.value as string);
    };

    const [searchEntry, setSearchEntry] = React.useState("")

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };


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

    const [formFirstName, setFormFirstName] = React.useState("")
    const handleChangeFormFirstName = (event: SelectChangeEvent) => {
        setFormFirstName(event.target.value as string);
    };

    const [formType, setFormType] = React.useState("")
    const handleChangeFormType = (event: SelectChangeEvent) => {
        setFormType(event.target.value as string);
    };

    const [formSurName, setFormSurName] = React.useState("")
    const handleChangeFormSurName = (event: SelectChangeEvent) => {
        setFormSurName(event.target.value as string);
    };

    const Form = ()=>{

        React.useEffect(() =>{
            setCanClose(true)
        });
        return(
            <ClickAwayListener onClickAway={handleClose}>
                <div className={styles.formCenter}>
                    <div className={styles.form}>
                        <h2 style={{color:"black"}}>Gebruiker Toevoegen</h2>
                        <div className={styles.formFields}>
                            <div className={styles.field}>
                                <TextField
                                    required
                                    label="voornaam"
                                    value={formFirstName}
                                    onChange={handleChangeFormFirstName}
                                />
                            </div>
                            <div className={styles.field}>
                                <TextField
                                    required
                                    label="achternaam"
                                    value={formSurName}
                                    onChange={handleChangeFormSurName}
                                />
                            </div>
                            <FormControl sx={{minWidth: 150 }} required>
                                <InputLabel>type</InputLabel>
                                <Select
                                    value={formType}
                                    onChange={handleChangeFormType}
                                    label="type"
                                    defaultValue=""
                                    MenuProps={{ disablePortal: true }}
                                >
                                    {dummyType.map((option) => (
                                        <MenuItem id="menuitem" key={option} value={option} style={{wordBreak: "break-all",whiteSpace: 'normal',}}>
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
                <h1>Gebruikers</h1>
                <p>{dummyUsers.length} gevonden resultaten</p>
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
                            <Select
                                displayEmpty={true}
                                multiple
                                value={region}
                                onChange={handleChangeRegion}
                                renderValue={() => "regio"}
                            >
                                <MenuItem key={"Alles "+((RegionAllesSelected)?"deselecteren":"selecteren")} value={"Alles"}>
                                    <Checkbox style ={{color: "#1C1C1C",}} checked={RegionAllesSelected} />
                                        <ListItemText style ={{width: 150, }} primary={"Alles "+((RegionAllesSelected)?"deselecteren":"selecteren")} />
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
                            <Select
                                displayEmpty={true}
                                multiple
                                value={type}
                                onChange={handleChangeType}
                                renderValue={() => "type"}
                            >
                                <MenuItem key={"Alles "+((TypeAllesSelected)?"deselecteren":"selecteren")} value={"Alles"}>
                                    <Checkbox style ={{color: "#1C1C1C",}} checked={TypeAllesSelected} />
                                        <ListItemText style ={{width: 150, }} primary={"Alles "+((TypeAllesSelected)?"deselecteren":"selecteren")} />
                                </MenuItem>
                                {dummyType.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox style ={{color: "#1C1C1C",}} checked={type.indexOf(option) > -1} />
                                        <ListItemText primaryTypographyProps={{ style: { whiteSpace: "normal", wordBreak: "break-all" } }}  primary={option} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Button variant="contained" className={styles.button} onMouseUp={handleToggle}>
                    <AddIcon />
                    Gebruiker Toevoegen
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
    type: string,
    regio: string
    onClick: React.Dispatch<React.SetStateAction<number|null>>
}

const ListItem = ({id, current, naam, type, regio, onClick}: ListItemProps) => {
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
                    {type}
                </div>
                <div className={styles.small_item_text}>
                    {regio}
                </div>
            </Button>
        </div>
    );
};
