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

interface User {
    id: number
    naam: string,
    regio: string,
    type: string
}

const dummyUsers:User[] = [
    {id: 7, naam: "Bavo", type: "student", regio: "Gent"},
    {id: 1, naam: "Lander", type: "superstudent", regio: "Antwerpen"},
    {id: 2, naam: "Jef", type: "admin", regio: "Gent"},
    {id: 3, naam: "Maxim", type: "syndicus", regio: "Gent"},
    {id: 4, naam: "Pim", type: "syndicus", regio: "Antwerpen"},
    {id: 5, naam: "Joris", type: "student", regio: "Gent"},
    {id: 6, naam: "Jahid", type: "student", regio: "Gent"},
    {id: 0, naam: "persoon 2", type: "admin", regio: "Antwerpen"},
    {id: 8, naam: "persoon 3", type: "syndicus", regio: "Gent"},
    {id: 9, naam: "persoon 1", type: "superstudent", regio: "Gent"},
    {id: 10, naam: "Trump", type: "superstudent", regio: "Antwerpen"},
    {id: 11, naam: "Biden", type: "superstudent", regio: "Gent"},
]

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];

const dummyTypes = [
    'student',
    'superstudent',
    'admin',
    'syndicus',
];

export default function UserList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam")
    const [region, setRegion] = React.useState("")
    const [type, setType] = React.useState("")

    const sortedUsers = dummyUsers.sort(function(first, second) {
        return (first[sorttype as keyof User] as string).localeCompare(second[sorttype as keyof User] as string);})
    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if(element != null){
            element.scrollTo({top: 0, behavior: 'smooth'})
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
                                id={x.id} current={current} naam={x.naam} type={x.type} regio={x.regio} onClick={setCurrent} />)}
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
    type: string,
    setType: React.Dispatch<React.SetStateAction<string>>
}

function TopBar({sorttype, setSorttype, region, setRegion, type, setType}:TopBarProps){
    const regions = [
        'Gent',
        'Antwerpen',
        'Brussel',
    ];

    const handleChangeRegion = (event: SelectChangeEvent) => {
        setRegion(event.target.value as string);
    };

    const handleChangeType = (event: SelectChangeEvent) => {
        setType(event.target.value as string);
    };

    const sorttypes = [
        "naam",
        'type',
        'regio'
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

    const [formName, setFormName] = React.useState("")
    const handleChangeFormName = (event: SelectChangeEvent) => {
        setFormName(event.target.value as string);
    };

    const [formType, setFormType] = React.useState("")
    const handleChangeFormType = (event: SelectChangeEvent) => {
        setFormType(event.target.value as string);
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
                        <h2 style={{color:"black"}}>Gebruiker Toevoegen</h2>
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
                            <FormControl sx={{minWidth: 150 }}>
                                <InputLabel>type</InputLabel>
                                <Select
                                    value={formType}
                                    onChange={handleChangeFormType}
                                    label="type"
                                    defaultValue=""
                                    MenuProps={{ disablePortal: true }}
                                >
                                    {dummyTypes.map((option) => (
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
                <h1>Gebruikers</h1>
                <p>{dummyUsers.length} gebruikers gevonden</p>
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
                                value={type}
                                onChange={handleChangeRegion}
                                label="type"
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
                    Gebruiker Toevoegen
                </Button>
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    invisible={false}
                >
                    {/*<Form></Form>*/}
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
