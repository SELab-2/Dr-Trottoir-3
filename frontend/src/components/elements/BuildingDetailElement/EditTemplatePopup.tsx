import * as React from 'react';
import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import {GarbageCollectionScheduleTemplate, GarbageCollectionScheduleTemplateEntry, GarbageType} from '@/api/models';
import {
    Autocomplete,
    Badge,
    Box,
    Button,
    Checkbox,
    createFilterOptions,
    FormControlLabel,
    FormGroup,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import {
    deleteGarbageCollectionScheduleTemplateEntry,
    getGarbageCollectionScheduleTemplateDetailEntries,
    getGarbageTypesList,
    postGarbageCollectionScheduleTemplate,
    postGarbageCollectionScheduleTemplateEntry,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Assignment} from '@mui/icons-material';

type optionType = GarbageCollectionScheduleTemplate & { inputValue?: string };

export interface SimpleDialogProps {
    buildingId: number;
    open: boolean;
    templates: optionType[];
    selectedTemplate: optionType | null;
    setSelectedTemplate: (templateName: GarbageCollectionScheduleTemplate | null) => void;
    onClose: () => void;
    updateList: () => void;
}

const filter = createFilterOptions<optionType>();

export default function EditTemplatePopup({
    onClose,
    updateList,
    templates,
    selectedTemplate,
    setSelectedTemplate,
    open,
    buildingId,
}: SimpleDialogProps) {
    const {data: session} = useSession();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [originalEntries, setOriginalEntries] = useState<GarbageCollectionScheduleTemplateEntry[]>([]);
    const [newEntries, setNewEntries] =
        useState<(Omit<GarbageCollectionScheduleTemplateEntry, 'id'> & { id?: number })[]>([]);
    const [selectedDay, setSelectedDay] = useState<number>(0);
    const [subDialogOpen, setSubDialogOpen] = useState<boolean>(false);


    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
    }, []);

    useEffect(loadTemplate, [selectedTemplate, open]);

    function loadTemplate() {
        if (selectedTemplate && selectedTemplate.id) {
            getGarbageCollectionScheduleTemplateDetailEntries(session, (res) => {
                if (res?.data) {
                    setOriginalEntries(res.data);
                    setNewEntries(res.data);
                }
            }, selectedTemplate.id);
        } else {
            setOriginalEntries([]);
            setNewEntries([]);
        }
    }

    function weeksCount() {
        return Math.ceil((Math.max(-1, ...newEntries.map(({day}) => day)) + 1) / 7 + 1);
    }

    function getGarbageTypeEntries(dayNr: number): (GarbageType & { selected: boolean })[] {
        const typesPresent = newEntries.filter(({day}) => day === dayNr).map((e) => e.garbage_type);
        return garbageTypes?.data.map(({name, id}) => ({
            name: name,
            selected: typesPresent.includes(id),
            id: id,
        })) || [];
    }

    function setGarbageTypeEntry(dayNr: number, garbageTypeEntry: GarbageType & { selected: boolean }): void {
        if (selectedTemplate) {
            const otherEntries = newEntries.filter((newEntry) =>
                !(newEntry.day === dayNr && newEntry.garbage_type === garbageTypeEntry.id));
            if (garbageTypeEntry.selected) {
                const newEntry = {
                    day: dayNr,
                    garbage_type: garbageTypeEntry.id,
                    garbage_collection_schedule_template: selectedTemplate.id,
                };
                setNewEntries([newEntry, ...otherEntries]);
            } else {
                setNewEntries(otherEntries);
            }
        }
    }

    function save() {
        const deletedEntries = originalEntries.filter((original) =>
            !newEntries.find((newEntry) =>
                newEntry.day == original.day && newEntry.garbage_type == original.garbage_type));
        const addedEntries = newEntries.filter((newEntry) =>
            !originalEntries.find((original) =>
                newEntry.day == original.day && newEntry.garbage_type == original.garbage_type));

        deletedEntries.forEach(({id}) => deleteGarbageCollectionScheduleTemplateEntry(session, id));
        addedEntries.forEach((entry) => postGarbageCollectionScheduleTemplateEntry(session, entry));
        onClose();
    }

    return (
        <Dialog open={open} fullWidth>
            <Box padding={2}>
                <Box display={'flex'} gap={2} width={'100%'}>
                    <Box flexGrow={1}>
                        <Autocomplete
                            id='cbx-template'
                            value={selectedTemplate}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    postGarbageCollectionScheduleTemplate(session, {
                                        name: newValue,
                                        building: buildingId,
                                    }, (res) => {
                                        setSelectedTemplate(res?.data || null);
                                        updateList();
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    postGarbageCollectionScheduleTemplate(session, {
                                        name: newValue.inputValue,
                                        building: buildingId,
                                    }, (res) => {
                                        setSelectedTemplate(res?.data || null);
                                        updateList();
                                    });
                                } else {
                                    setSelectedTemplate(newValue);
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                const {inputValue} = params;
                                // Suggest the creation of a new value
                                const isExisting = options.some((option) => inputValue === option.name);
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        name: `Maak nieuw template: '${inputValue}'`,
                                        id: 0, building: 0,
                                    });
                                }

                                return filtered;
                            }}
                            options={templates}
                            getOptionLabel={(option) => {
                                // e.g. value selected with enter, right from the input
                                if (typeof option === 'string') {
                                    return option;
                                }
                                if (option.inputValue) {
                                    return option.inputValue;
                                }
                                return option.name;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            renderOption={(props, option) => <li {...props}>{option.name}</li>}
                            fullWidth
                            freeSolo
                            renderInput={(params) => <TextField {...params} label='Template'/>}
                        />
                    </Box>
                    <Button variant='contained' onClick={save}>Opslaan</Button>
                    <Button variant='outlined' color={'inherit'} onClick={onClose}>Annuleren</Button>
                </Box>
                <Box>
                    {selectedTemplate ? Array.from(Array(weeksCount())).map((_, week) => (
                        <Box key={week}>
                            <Typography>Week {week + 1}</Typography>
                            <Box display={'flex'}>
                                {['maa', 'din', 'woe', 'don', 'vri', 'zat', 'zon'].map((weekdag, dagnr) => (
                                    <FormControlLabel key={weekdag} control={
                                        <IconButton
                                            onClick={() => {
                                                setSelectedDay(week * 7 + dagnr);
                                                setSubDialogOpen(true);
                                            }}>
                                            <Badge
                                                badgeContent={getGarbageTypeEntries(week * 7 + dagnr)
                                                    .filter(({selected}) => selected)
                                                    .length}
                                                color={'primary'}>
                                                <Assignment/>
                                            </Badge>
                                        </IconButton>
                                    } label={weekdag} labelPlacement={'bottom'}/>
                                ))}
                            </Box>
                        </Box>
                    )) : <></>}
                </Box>
            </Box>
            <GarbageTypeDialog open={subDialogOpen} onClose={() => setSubDialogOpen(false)}
                garbageTypeEntries={getGarbageTypeEntries(selectedDay)}
                setGarbageTypeEntry={(e) => setGarbageTypeEntry(selectedDay, e)}/>
        </Dialog>
    );
}

interface GTDProps {
    open: boolean;
    onClose: () => void;
    garbageTypeEntries: (GarbageType & { selected: boolean })[];
    setGarbageTypeEntry: (garbageTypes: (GarbageType & { selected: boolean })) => void;
}

function GarbageTypeDialog({open, onClose, garbageTypeEntries, setGarbageTypeEntry}: GTDProps) {
    return (
        <Dialog onClose={onClose} open={open}>
            <Box padding={2}>
                <FormGroup>
                    {garbageTypeEntries.map(({name, selected, id}, index) => (
                        <FormControlLabel key={index}
                            control={
                                <Checkbox checked={selected}
                                    onChange={() => setGarbageTypeEntry({
                                        name,
                                        selected: !selected,
                                        id,
                                    })}
                                    name='jason'/>
                            }
                            label={name}
                        />
                    ))}
                </FormGroup>
                <Button fullWidth variant={'contained'} onClick={onClose}>Ok</Button>
            </Box>
        </Dialog>
    );
}
