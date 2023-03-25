import React from "react";
import styles from "@/components/elements/buildingsListElement/BuildingsList.module.css";
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {Button, IconButton, InputBase} from "@mui/material";



const dummyBuildings = [
    {name: "building 1", adress: "building 1 street 69", locationGroup: "Gent"},
    {name: "building 2", adress: "building 2 street 42", locationGroup: "Antwerpen"},
    {name: "building 3", adress: "building 3 lane 21", locationGroup: "Gent"},
]


export default function BuildingsList() {
    return (
        <div className={styles.full_outer}>

            <TopBar></TopBar>
            <div className={styles.under_columns}>
                <div className={styles.list_bar}>
                    {dummyBuildings.map(x => )}
                </div>
                axa
            </div>

        </div>
    );
}

function TopBar(){
    return (
        <div className={styles.topBar}>
            <div id={styles.title}>
                <h1>Gebouwen</h1>
                <p>{dummyBuildings.length} gebouwen gevonden</p>
            </div>

            <div id={styles.search}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        sx={{ p: '5px' }}
                        autoComplete={"true"}
                        placeholder="Zoek op naam"
                    />
                </Box>
            </div>

        </div>

    );
}


function Filter(){

}

type ListItemProps = {
    name: string,
    adress: string,
    locationGroup: string
}

const NavButton = ({name, adress, locationGroup}: ListItemProps) => {
    return (
        <Button id={styles.item_button} className={styles.button_default}>
            {name}

                    </Button>
    );
};
