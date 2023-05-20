import {Box, IconButton, Typography} from '@mui/material';
import styles from '../../elements/BuildingDetailElement/buildingEditLists.module.css';
import React, {useEffect, useState} from 'react';
import {GarbageType, ScheduleAssignment} from '@/api/models';
import {useSession} from 'next-auth/react';
import {
    getGarbageTypesList, getScheduleAssignmentsList,
    useAuthenticatedApi,
} from '@/api/api';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import {ArrowDownward, ArrowUpward} from '@mui/icons-material';
import dayjs, {Dayjs} from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/locale/nl-be';

dayjs.extend(minMax);

export default function ScheduleAssignmentList({buildingId}: { buildingId: number }) {
    const {data: session} = useSession();

    const [schedulesFilterDate, setSchedulesFilterDate] =
        useState<Dayjs>(dayjs(undefined, {locale: 'nl-be'}).startOf('week'));
    const [schedules, setSchedules] = useAuthenticatedApi<ScheduleAssignment[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();

    const updateSchedules = () => getScheduleAssignmentsList(session, setSchedules, {
        schedule_definition: buildingId,
        assigned_date__gt: schedulesFilterDate.format('YYYY-MM-DD'),
    });

    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
        updateSchedules();
    }, [buildingId]);

    useEffect(updateSchedules, [schedulesFilterDate]);

    function schedulesPerWeek() {
        const fancySchedules = schedules?.data.map((schedule) => ({
            id: schedule.id,
            for_day: dayjs(schedule.assigned_date, {locale: 'nl-be'}),
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
                                        </Typography>
                                        <Box flexShrink={0}>
                                        </Box>
                                    </Box>
                                </Box>) : <></>
                            }
                        </Box>
                    )}
                    {/* </div>*/}
                </div> :
                <LoadingElement/>
            }
        </Box>);
}
