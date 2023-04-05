import React, {useEffect} from "react";
import styles from "@/styles/ListView.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import {
    Checkbox,
    FormControl,
    IconButton,
    InputBase,
    InputLabel, ListItemText,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";

const dummyRegions = [
    'Gent',
    'Antwerpen',
    'Brussel',
];

export default function SchedulesList() {
    const [region, setRegion] = React.useState<string[]>(dummyRegions);

    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if(element != null){
            element.scrollTo({top: 0, behavior: 'smooth'})
        }
    }, [region]);
    return (
        <>
            <TopBar region={region} setRegion={setRegion}></TopBar>
        </>
    );
}


type TopBarProps = {
    region: string[],
    setRegion: React.Dispatch<React.SetStateAction<string[]>>
}

function TopBar({region, setRegion}:TopBarProps){
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

    const [searchEntry, setSearchEntry] = React.useState("")

    const handleChangeSearchEntry = (event: SelectChangeEvent) => {
        setSearchEntry(event.target.value as string);
    };

    return (
        <div  className={styles.topBar}>
            <div className={styles.title}>
                <h1>Planning</h1>
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
                            <Select
                                displayEmpty={true}
                                multiple
                                value={region}
                                onChange={handleChangeRegion}
                                renderValue={() => "regio"}
                            >
                                <MenuItem key={"Alles "+((AllesSelected)?"deselecteren":"selecteren")} value={"Alles"}>
                                    <Checkbox style ={{color: "var(--primary-dark)",}} checked={AllesSelected} />
                                        <ListItemText style ={{width: 150, }} primary={"Alles "+((AllesSelected)?"deselecteren":"selecteren")} />
                                </MenuItem>
                                {dummyRegions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        <Checkbox style ={{color: "var(--primary-dark)",}} checked={region.indexOf(option) > -1} />
                                        <ListItemText primaryTypographyProps={{ style: { var(--primary-light)Space: "normal", wordBreak: "break-all" } }}  primary={option} />
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



