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

const dummySindici = [
    {name: "joe mama"},
    {name: "gay bowser"},
    {name: "willie stroker"}
];

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];

export default function BuildingsList() {
    const [current, setCurrent] = useState<number | null>(null);
    const [sorttype , setSorttype] = React.useState("naam");
    const [region, setRegion] = React.useState<string[]>(dummyRegions);

    const sortedBuildings = dummyBuildings.sort(function(first, second) {
        return (first[sorttype as keyof Building] as string).localeCompare(second[sorttype as keyof Building] as string);})
    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if(element != null){
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
      }, [sorttype,region]);
    return (
        <>
            <div className={styles.full_outer}>

                <TopBar sorttype={sorttype} setSorttype={setSorttype} region={region} setRegion={setRegion}></TopBar>
            <div className={styles.under_columns}>
                <div className={styles.list_wrapper}>
                    <div className={styles.list_bar} id={styles.scroll_style}>
                        {sortedBuildings.map(x => <ListItem
                            id={x.id} current={current} naam={x.naam} adres={x.adres} regio={x.regio} onClick={setCurrent} />)}
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
                            <FormControl required sx={{minWidth: 150 }}>
                                <InputLabel>regio</InputLabel>
                                <Select
                                    value={formRegion}
                                    onChange={handleChangeFormRegion}
                                    label="regio"
                                    defaultValue=""
                                    MenuProps={{ disablePortal: true }}
                                >
                                    {dummyRegions.map((option) => (
                                        <MenuItem id="menuitem" key={option} value={option} style={{wordBreak: "break-all",whiteSpace: 'normal',}}>
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
                                    <MenuItem value="">
                                        <em>geen</em>
                                    </MenuItem>
                                    {dummySindici.map((option) => (
                                        <MenuItem id="menuitem" key={option.name} value={option.name} style={{wordBreak: "break-all",whiteSpace: 'normal',}}>
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
                <p>{dummyBuildings.length} gevonden resultaten</p>
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
