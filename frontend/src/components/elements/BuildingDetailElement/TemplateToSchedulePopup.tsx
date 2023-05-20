import {useSession} from 'next-auth/react';
import {
    getBuildingDetailGarbageCollectionScheduleTemplates,
    getGarbageCollectionScheduleTemplateDetailEntries,
    getGarbageTypesList,
    postGarbageCollectionSchedule,
    useAuthenticatedApi,
} from '@/api/api';
import {GarbageCollectionScheduleTemplate, GarbageCollectionScheduleTemplateEntry, GarbageType} from '@/api/models';
import {Autocomplete, Box, Button, Dialog, TextField, Typography} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import dayjs, {Dayjs} from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import React, {useEffect, useState} from 'react';
import 'dayjs/locale/nl-be';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import styles from '../../../styles/forms.module.css';

interface propsType {
    open: boolean,
    onClose: (refresh: boolean) => void,
    buildingId: number,
    defaultDate?: Dayjs,
}

export default function TemplateToSchedulePopup({open, onClose, buildingId, defaultDate}: propsType) {
    const {data: session} = useSession();

    const setDefaultDate = () => defaultDate ? defaultDate : dayjs().subtract(1, 'day').startOf('week').add(8, 'days');
    useEffect(() => setSelectedDate(setDefaultDate()), [defaultDate]);

    const [templates, setTemplates] = useAuthenticatedApi<GarbageCollectionScheduleTemplate[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();
    const [templateEntries, setTemplateEntries] = useAuthenticatedApi<GarbageCollectionScheduleTemplateEntry[]>();

    const [selectedTemplate, setSelectedTemplate] = useState<GarbageCollectionScheduleTemplate | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(setDefaultDate());

    const [schedulesPerWeek, setSchedulesPerWeek] =
        useState<{
            monday: dayjs.Dayjs,
            sunday: dayjs.Dayjs,
            schedules: { garbage_type: GarbageType, for_day: dayjs.Dayjs
            }[] }[]>();

    useEffect(() => {
        getBuildingDetailGarbageCollectionScheduleTemplates(session, setTemplates, buildingId);
        getGarbageTypesList(session, setGarbageTypes);
        setSelectedTemplate(null);
    }, [buildingId]);

    useEffect(() => {
        if (selectedTemplate) {
            getGarbageCollectionScheduleTemplateDetailEntries(session, setTemplateEntries, selectedTemplate.id);
        } else setTemplateEntries(undefined);
    }, [selectedTemplate]);

    function updateSchedules() {
        if (!(templateEntries?.data && selectedDate && garbageTypes?.data)) {
            setSchedulesPerWeek(undefined);
            return;
        }
        if (templateEntries.data.length === 0) {
            setSchedulesPerWeek([]);
            return;
        }
        const fancySchedules = templateEntries.data.map((entry) => ({
            garbage_type: garbageTypes.data.find(({id}) => id === entry.garbage_type) || {id: -1, name: 'ERROR'},
            for_day: selectedDate.add(entry.day, 'day'),
        }));
        const firstDay = dayjs.min(fancySchedules.map((s) => s.for_day)).startOf('week');
        const lastDay = dayjs.max(fancySchedules.map((s) => s.for_day)).startOf('week').add(1, 'week');
        const perWeek = [];
        for (let monday = firstDay; monday < lastDay;) {
            const nextMonday = monday.add(7, 'day');
            const sunday = monday.add(6, 'day');
            perWeek.push({
                monday,
                sunday,
                schedules: fancySchedules
                    .filter((s) => s.for_day >= monday && s.for_day < nextMonday)
                    .sort((a, b) => a.for_day.valueOf() - b.for_day.valueOf()),
            });
            monday = nextMonday;
        }
        setSchedulesPerWeek(perWeek);
    }

    function saveSchedules() {
        if (!schedulesPerWeek?.length) {
            onClose(false);
            return;
        }
        Promise.all(
            schedulesPerWeek
                .map(({schedules}) => schedules)
                .flat()
                .map((s) => ({
                    garbage_type: s.garbage_type.id,
                    for_day: s.for_day.format('YYYY-MM-DD'),
                    building: buildingId,
                }))
                .map((schedule) => new Promise((resolve) => postGarbageCollectionSchedule(session, schedule, resolve)))
        ).then(() => onClose(true));
    }

    useEffect(updateSchedules, [selectedDate, templateEntries]);

    function dateFmt(date: Dayjs) {
        return date.format('dd DD/MM');
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            {templates?.data && garbageTypes?.data ?
                <Box padding={2} gap={2} display={'flex'} flexDirection={'column'}>
                    <Box display={'flex'} gap={1}>
                        <Autocomplete
                            sx={{flexGrow: 1}}
                            renderInput={(params) => <TextField {...params} label="Template"/>}
                            options={templates.data}
                            getOptionLabel={({name}) => name}
                            value={selectedTemplate}
                            onChange={(_, val) => setSelectedTemplate(val)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'nl-be'}>
                            <DatePicker
                                sx={{flexBasis: 150}} value={selectedDate}
                                onChange={setSelectedDate}/>
                        </LocalizationProvider>
                        <Button disabled={!(selectedTemplate && selectedDate && templateEntries?.data)}
                            onClick={saveSchedules}
                            className={styles.submit_button} style={{width: 'fit-content'}}>Opslaan</Button>
                        <Button
                            onClick={() => onClose(false)}
                            className={styles.cancel_button}
                            style={{width: 'fit-content'}}>
                            Annuleren
                        </Button>
                    </Box>
                    {schedulesPerWeek?.length ?
                        <Box>
                            {schedulesPerWeek.map(({monday, sunday, schedules}, index) =>
                                <Box key={index}>
                                    <Typography
                                        variant={'subtitle2'}>{dateFmt(monday)} tot {dateFmt(sunday)}</Typography>
                                    {schedules.length ? schedules.map((schedule, index) =>
                                        <Box paddingBottom={1} key={index}>
                                            <Box
                                                bgcolor={'var(--secondary-light)'}
                                                borderRadius={'var(--small_corner)'} gap={1}
                                                paddingY={0.2} paddingX={'3%'} alignItems={'center'} display={'flex'}
                                            >
                                                <Typography noWrap flexShrink={0}>
                                                    {dateFmt(schedule.for_day)}
                                                </Typography>
                                                <Typography noWrap flexGrow={1} variant={'button'}>
                                                    {schedule.garbage_type?.name}
                                                </Typography>
                                            </Box>
                                        </Box>) :
                                        <Box paddingBottom={1}>
                                            <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                                                paddingY={0.2} paddingX={'3%'} display={'flex'}>
                                                <Typography>Geen ophalingen</Typography>
                                            </Box>
                                        </Box>
                                    }
                                </Box>
                            )}
                        </Box> :
                        <Typography>
                            Gelieve een template en datum te selecteren.
                        </Typography>}
                </Box> :
                <LoadingElement/>}
        </Dialog>
    );
}
