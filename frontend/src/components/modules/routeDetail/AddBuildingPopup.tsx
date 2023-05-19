import * as React from 'react';
import {useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {Building} from '@/api/models';
import {Autocomplete, Box, Button, TextField} from '@mui/material';
import styles from '../../../styles/forms.module.css'

export interface SimpleDialogProps {
    open: boolean;
    buildings: Building[];
    onClose: (id: number | undefined) => void;
}

export default function AddBuildingPopup({onClose, buildings, open}: SimpleDialogProps) {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    useEffect(() => {
        if (open) {
            setSelectedBuilding(null);
        }
    }, [open]);

    return (
        <Dialog onClose={() => onClose(undefined)} open={open}>
            <DialogTitle>Voeg een gebouw toe</DialogTitle>
            <Box padding={2} display={'flex'} flexDirection={'column'} justifyContent={'center'} gap={2}>
                <Autocomplete
                    sx={{
                        '& .MuiInputLabel-root': {
                            padding: '2px',
                        },
                        '& label.Mui-focused': {
                            color: 'var(--primary-yellow)',
                            borderRadius: '8px',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: 'var(--primary-yellow)',
                            borderRadius: '8px',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'var(--secondary-light)',
                                borderRadius: '8px',
                            },
                            '&:hover fieldset': {
                                borderColor: 'var(--secondary-light)',
                                borderRadius: '8px',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'var(--primary-yellow)',
                                borderRadius: '8px',
                            },
                        },
                    }}
                    size="small"
                    options={buildings}
                    getOptionLabel={(building) => `${building.name} (${building.address})`}
                    renderInput={(params) => <TextField {...params} label="Gebouw"/>}
                    onChange={(e, val) => setSelectedBuilding(val)}
                />
                <Button className={styles.submit_button}
                    onClick={() => selectedBuilding ? onClose(selectedBuilding.id) : undefined}
                >
                    Toevoegen
                </Button>
            </Box>
        </Dialog>
    );
}
