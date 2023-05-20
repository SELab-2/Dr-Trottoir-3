import {Box, Typography} from '@mui/material';
import styles from '../BuildingDetailElement/buildingEditLists.module.css';

import {ScheduleAssignment, ScheduleDefinition} from '@/api/models';
import dayjs, {Dayjs} from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/locale/nl-be';
import React from "react";

dayjs.extend(minMax);

export default function AssignmentList({title, schedules, definitions}: { title: string, schedules: ScheduleAssignment[], definitions: ScheduleDefinition[] }) {

    function futureSchedulesPerWeek() {
        const fancySchedules = schedules.map((schedule) => ({
            id: schedule.id,
            route: definitions.filter(e => e.id === schedule.schedule_definition).at(0),
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
            <Typography variant='h5'>{title}</Typography>
            <Box paddingBottom={1}>
                <Box
                    bgcolor={'var(--secondary-light)'}
                    borderRadius={'var(--small_corner)'} gap={1}
                    paddingY={0.2} paddingX={'3%'} alignItems={'center'} justifyContent={'center'} display={'flex'}
                >
                </Box>
            </Box>
            <div className={styles.scrollable_container}>
                {futureSchedulesPerWeek().map(({monday, sunday, schedules}, index) =>
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
                                            {schedule.route?.name}
                                        </Typography>
                                        <Box flex={2}/>
                                        <Typography noWrap variant={'button'}>
                                            {dateFmt(schedule.for_day)}
                                        </Typography>
                                    </Box>
                                </Box>) :
                            <Box paddingBottom={1}>
                                <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                                     paddingY={0.2} paddingX={'3%'} display={'flex'}>
                                    <Box flexGrow={1}/>
                                    <Box flexGrow={1}/>
                                </Box>
                            </Box>
                        }
                    </Box>
                )}
            </div>
        </Box>);
}
