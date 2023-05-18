import {useSession} from 'next-auth/react';
import {Autocomplete, Box, Button, Dialog, DialogTitle, TextField} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {
    getGarbageCollectionScheduleDetail,
    getGarbageTypesList,
    patchGarbageCollectionScheduleDetail,
    postGarbageCollectionSchedule,
    useAuthenticatedApi,
} from '@/api/api';
import {GarbageCollectionSchedule, GarbageType} from '@/api/models';
import dayjs, {Dayjs} from 'dayjs';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import 'dayjs/locale/nl-be';
import styles from '@/styles/forms.module.css';

interface propsType {
    open: boolean,
    onClose: (refresh: boolean) => void,
    buildingId: number,
    scheduleId?: number,
    defaultDate?: Dayjs,
}

export default function EditSchedulePopup({open, onClose, buildingId, scheduleId, defaultDate}: propsType) {
    const {data: session} = useSession();

    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [originalSchedule, setOriginalSchedule] = useAuthenticatedApi<GarbageCollectionSchedule>();

    type FancySchedule = {
        id: number, for_day: Dayjs | null, building: number, garbage_type: GarbageType | null, note: string
    }
    const [schedule, setSchedule] = useState<Partial<FancySchedule>>();


    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
    }, []);

    useEffect(() => {
        if (scheduleId !== undefined) getGarbageCollectionScheduleDetail(session, setOriginalSchedule, scheduleId);
        else setOriginalSchedule(undefined);
    }, [scheduleId]);

    useEffect(() => {
        if (!(garbageTypes?.data && (scheduleId === undefined || originalSchedule?.data))) {
            setSchedule(undefined);
            return;
        }
        setSchedule({
            id: scheduleId,
            building: buildingId,
            for_day: originalSchedule?.data ?
                dayjs(originalSchedule.data.for_day, {locale: 'nl-be'}) :
                defaultDate || dayjs(undefined, {locale: 'nl-be'}).startOf('day'),
            garbage_type: originalSchedule?.data ?
                garbageTypes.data.find((g) => g.id == originalSchedule.data.garbage_type) :
                null,
            note: originalSchedule?.data.note || '',
        });
    }, [garbageTypes, originalSchedule, defaultDate]);

    function onSave() {
        if (!(schedule?.for_day && schedule?.garbage_type)) {
            onClose(false);
        } else if (schedule.id) {
            patchGarbageCollectionScheduleDetail(session, schedule.id, {
                for_day: schedule.for_day.format('YYYY-MM-DD'),
                garbage_type: schedule.garbage_type.id,
                note: schedule.note || undefined,
            }, () => onClose(true));
        } else {
            postGarbageCollectionSchedule(session, {
                for_day: schedule.for_day.format('YYYY-MM-DD'),
                garbage_type: schedule.garbage_type.id,
                note: schedule.note || undefined,
                building: buildingId,
            }, () => onClose(true));
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Ophaling {scheduleId ? 'aanpassen' : 'toevoegen'}</DialogTitle>
            {schedule && garbageTypes?.data ?
                <Box padding={1} display={'flex'} flexDirection={'column'} gap={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'nl-be'}>
                        <DatePicker
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
                            className={styles.input}
                            value={schedule.for_day} onChange={(v) => setSchedule({...schedule, for_day: v})}/>
                    </LocalizationProvider>
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
                        renderInput={(params) =>
                            <TextField {...params} label="Afval Type"/>}
                        options={garbageTypes.data}
                        getOptionLabel={({name}) => name}
                        value={schedule.garbage_type}
                        onChange={(_, val) =>
                            setSchedule({...schedule, garbage_type: val})}
                    />
                    <TextField multiline value={schedule.note}
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
                        InputProps={{
                            style: {height: '45px'},
                        }}
                        onChange={(e) => setSchedule({...schedule, note: e.target.value})}
                        label={'Opmerking'}/>
                    <Button
                        className={styles.submit_button}
                        disabled={!(schedule.for_day && schedule.garbage_type)}
                        onClick={onSave}>Opslaan</Button>
                    <Button className={styles.cancel_button} onClick={() => onClose(false)} >Annuleren</Button>
                </Box> :
                <LoadingElement/>}
        </Dialog>
    );
}
