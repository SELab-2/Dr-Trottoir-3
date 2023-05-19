import {Box, IconButton, Tooltip, Typography} from '@mui/material';
import styles from './buildingEditLists.module.css';
import React, {useEffect, useState} from 'react';
import {GarbageCollectionSchedule, GarbageType} from '@/api/models';
import {useSession} from 'next-auth/react';
import {
    deleteGarbageCollectionSchedule,
    getGarbageCollectionsSchedulesList,
    getGarbageTypesList,
    useAuthenticatedApi,
} from '@/api/api';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import {Add, ArrowDownward, ArrowUpward, Clear, Edit, PlaylistAdd} from '@mui/icons-material';
import dayjs, {Dayjs} from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/locale/nl-be';
import TemplateToSchedulePopup from '@/components/elements/BuildingDetailElement/TemplateToSchedulePopup';
import EditSchedulePopup from '@/components/elements/BuildingDetailElement/EditSchedulePopup';

dayjs.extend(minMax);

export default function GarbageCollectionScheduleList({buildingId}: { buildingId: number }) {
    const {data: session} = useSession();

    const [schedulesFilterDate, setSchedulesFilterDate] =
        useState<Dayjs>(dayjs(undefined, {locale: 'nl-be'}).startOf('week'));
    const [schedules, setSchedules] = useAuthenticatedApi<GarbageCollectionSchedule[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();

    const [templateToSchedulePopup, setTemplateToSchedulePopup] = useState(false);
    const [defaultDate, setDefaultDate] = useState<Dayjs | undefined>();

    const [editSchedulePopup, setEditSchedulePopup] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<number | undefined>();

    const updateSchedules = () => getGarbageCollectionsSchedulesList(session, setSchedules, {
        building: buildingId,
        for_day__gt: schedulesFilterDate.format('YYYY-MM-DD'),
    });

    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
        updateSchedules();
    }, [buildingId]);

    useEffect(updateSchedules, [schedulesFilterDate]);

    function schedulesPerWeek() {
        const fancySchedules = schedules?.data.map((schedule) => ({
            id: schedule.id,
            note: schedule.note,
            garbage_type: garbageTypes?.data.find(({id}) => id === schedule.garbage_type),
            for_day: dayjs(schedule.for_day, {locale: 'nl-be'}),
        })) || [];

        if (fancySchedules.length === 0) {
            const nextMonday = dayjs(undefined, {locale: 'nl-be'}).startOf('week').add(1, 'week');
            return [{
                monday: nextMonday,
                sunday: nextMonday.add(6, 'day'),
                schedules: [],
            }];
        }
        const firstDay = dayjs.min(fancySchedules.map((s) => s.for_day)).startOf('week');
        const lastDay = dayjs.max(fancySchedules.map((s) => s.for_day)).startOf('week').add(1, 'week');

        // Groups schedules per week and saves the monday and sunday of that week
        const perWeek = [];
        for (let monday = firstDay; monday <= lastDay;) {
            const nextMonday = monday.add(1, 'week');
            const sunday = monday.add(6, 'day');
            perWeek.push({
                monday,
                sunday,
                schedules: fancySchedules
                    .filter((s) => s.for_day >= monday && s.for_day < nextMonday)
                    .sort((a, b) =>
                        a.for_day.valueOf() - b.for_day.valueOf()),
            });
            monday = nextMonday;
        }
        return (perWeek);
    }

    function dateFmt(date: Dayjs) {
        return date.format('dd DD/MM');
    }

    function openTemplateToSchedulePopup(date?: Dayjs) {
        setDefaultDate(date);
        setTemplateToSchedulePopup(true);
    }

    function openNewSchedulePopup(date?: Dayjs) {
        setDefaultDate(date);
        setEditSchedulePopup(true);
    }

    function openEditSchedulePopup(scheduleId?: number) {
        setSelectedSchedule(scheduleId);
        setEditSchedulePopup(true);
    }

    return (
        <Box className={styles.full_container}>
            <Typography variant='h5'>Planning</Typography>
            <Box paddingBottom={1}>
                <Box
                    bgcolor={'var(--secondary-light)'}
                    borderRadius={'var(--small_corner)'} gap={1}
                    paddingY={0.2} paddingX={'3%'} alignItems={'center'} justifyContent={'center'} display={'flex'}
                >
                    <IconButton size={'small'}
                        onClick={() => setSchedulesFilterDate(schedulesFilterDate.subtract(1, 'week'))}>
                        <ArrowUpward/>
                    </IconButton>
                    <Typography noWrap>
                        Vanaf {schedulesFilterDate.format('DD/MM/YYYY')}
                    </Typography>
                    <IconButton size={'small'}
                        onClick={() => setSchedulesFilterDate(schedulesFilterDate.add(1, 'week'))}>
                        <ArrowDownward/>
                    </IconButton>
                </Box>
            </Box>
            {schedules?.data && garbageTypes?.data ?
                <div className={styles.scrollable_container}>
                    {/* <div className={styles.scroll_list}>*/}
                    {schedulesPerWeek().map(({monday, sunday, schedules}, index) =>
                        <Box key={index}>
                            <Box display={'flex'} alignItems={'center'}>
                                <Typography noWrap
                                    variant={'subtitle2'}>{dateFmt(monday)} tot {dateFmt(sunday)}</Typography>

                                <Box flexGrow={1}/>
                                <IconButton onClick={() => openTemplateToSchedulePopup(monday)} size={'small'}>
                                    <Tooltip title={'Template plannen'}>
                                        <PlaylistAdd/>
                                    </Tooltip>
                                </IconButton>
                                <IconButton onClick={() => openNewSchedulePopup(monday)} size={'small'}>
                                    <Tooltip title={'Afzonderlijke ophaling plannen'}>
                                        <Add/>
                                    </Tooltip>
                                </IconButton>
                            </Box>
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
                                        <Box flexShrink={0}>
                                            <IconButton size={'small'} onClick={() =>
                                                openEditSchedulePopup(schedule.id)}>
                                                <Edit/>
                                            </IconButton>
                                            <IconButton size={'small'}
                                                onClick={() =>
                                                    deleteGarbageCollectionSchedule(
                                                        session,
                                                        schedule.id,
                                                        updateSchedules)}>
                                                <Clear/>
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>) :
                                <Box paddingBottom={1}>
                                    <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                                        paddingY={0.2} paddingX={'3%'} display={'flex'}>
                                        <Box flexGrow={1}/>
                                        <IconButton onClick={() => openTemplateToSchedulePopup(monday)} size={'small'}>
                                            <Tooltip title={'Template plannen'}>
                                                <PlaylistAdd/>
                                            </Tooltip>
                                        </IconButton>
                                        <Box flexGrow={1}/>
                                        <IconButton onClick={() => openNewSchedulePopup(monday)} size={'small'}>
                                            <Tooltip title={'Afzonderlijke ophaling plannen'}>
                                                <Add/>
                                            </Tooltip>
                                        </IconButton>
                                        <Box flexGrow={1}/>
                                    </Box>
                                </Box>
                            }
                        </Box>
                    )}
                    {/* </div>*/}
                    <TemplateToSchedulePopup open={templateToSchedulePopup}
                        onClose={(refresh) => {
                            setTemplateToSchedulePopup(false);
                            if (refresh) updateSchedules();
                        }}
                        defaultDate={defaultDate}
                        buildingId={buildingId}/>
                    <EditSchedulePopup open={editSchedulePopup} onClose={(refresh) => {
                        setEditSchedulePopup(false);
                        setSelectedSchedule(undefined);
                        if (refresh) updateSchedules();
                    }} buildingId={buildingId} scheduleId={selectedSchedule} defaultDate={defaultDate}/>
                </div> :
                <LoadingElement/>
            }
        </Box>);
}
