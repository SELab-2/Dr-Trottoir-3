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
    SelectChangeEvent, TextField,
} from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import {ClickAwayListener} from "@mui/base";

const dummyBuildings = [
    {name: "Upkot SintPieters", adress: "Uilkenslaan 93, Gent", locationGroup: "Gent"},
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

const dummySindici = [
    {name: "joe mama"},
    {name: "gay bowser"},
    {name: "willie stroker"}
]

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];


export default function BuildingsList() {
    const [current, setCurrent] = useState(0);

    return (
        <div className={styles.full_outer}>

            <TopBar></TopBar>
            <div className={styles.under_columns}>
                <div className={styles.list_wrapper}>
                    <div className={styles.list_bar} id={styles.scroll_style}>
                        {dummyBuildings.map((x,i) => <ListItem
                            id={i} current={current} name={x.name} adress={x.adress} locationGroup={x.locationGroup} onClick={setCurrent} />)}
                    </div>
                </div>
            </div>

        </div>
    );
}

function TopBar(){


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

    const [formAdres, setFormAdres] = React.useState("")
    const handleChangeFormAdres = (event: SelectChangeEvent) => {
        setFormAdres(event.target.value as string);
    };
    
    const [formRegion, setFormRegion] = React.useState("")
    const handleChangeFormRegion = (event: SelectChangeEvent) => {
        setFormRegion(event.target.value as string);
    };

    const [formSyndic, setFormSyndic] = React.useState("")
    const handleChangeFormSyndic = (event: SelectChangeEvent) => {
        setFormSyndic(event.target.value as string);
    };

    const Form = ()=>{

        React.useEffect(() =>{
            setCanClose(true)
        });
        return(
            <ClickAwayListener onClickAway={handleClose}>
                <div className={styles.formCenter}>
                    <div className={styles.form}>
                        <h2 style={{color:"black"}}>Gebouw Toevoegen</h2>
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
                            <div className={styles.field}>
                                <TextField
                                    required
                                    label="adres"
                                    value={formAdres}
                                    onChange={handleChangeFormAdres}
                                />
                            </div>
                            <FormControl sx={{minWidth: 200 }}>
                                <InputLabel>syndicus</InputLabel>
                                <Select
                                    value={formSyndic}
                                    onChange={handleChangeFormSyndic}
                                    label="syndicus"
                                    defaultValue=""
                                    MenuProps={{ disablePortal: true }}
                                >
                                    {dummySindici.map((option) => (
                                        <MenuItem id="menuitem" key={option.name} value={option.name}>
                                            {option.name}
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

            <Button variant="contained" className={styles.button} onMouseUp={handleToggle}>
                <AddIcon />
                Gebouw Toevoegen
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
    );
}


type ListItemProps = {
    id: number,
    current: number,
    name: string,
    adress: string,
    locationGroup: string
    onClick: React.Dispatch<React.SetStateAction<number>>
}

const ListItem = ({id, current, name, adress, locationGroup, onClick}: ListItemProps) => {
    const isCurrent = id == current
    return (
        <div className={styles.button_wrapper}>
            <Button id={(isCurrent)?styles.item_button_select : styles.item_button}
                    className={styles.button_default}
                    onClick={()=>onClick(id)}>
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
        </div>
    );
};
