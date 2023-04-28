import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Building} from '@/api/models';

export interface SimpleDialogProps {
    open: boolean;
    buildings: Building[];
    onClose: (id: number | undefined) => void;
}

export default function AddBuildingPopup({onClose, buildings, open}: SimpleDialogProps) {
    return (
        <Dialog onClose={() => onClose(undefined)} open={open}>
            <DialogTitle>Voeg een gebouw toe</DialogTitle>
            <List sx={{pt: 0}}>
                {buildings.map(({id, name, address}) => (
                    <ListItem disableGutters>
                        <ListItemButton onClick={() => onClose(id)} key={id}>
                            <ListItemText primary={name} secondary={address}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}
