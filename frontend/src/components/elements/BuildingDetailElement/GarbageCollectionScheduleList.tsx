import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {GarbageCollectionSchedule, GarbageType} from "@/api/models";
import {useSession} from "next-auth/react";
import {
    deleteGarbageCollectionScheduleTemplate,
    getBuildingDetailGarbageCollectionSchedules,
    getGarbageTypesList,
    useAuthenticatedApi
} from "@/api/api";
import LoadingElement from "@/components/elements/LoadingElement/LoadingElement";
import {Add, Clear, Edit, PlaylistAdd} from "@mui/icons-material";

export default function GarbageCollectionScheduleList({buildingId}: { buildingId: number }) {
    const {data: session} = useSession();

    // const [startDate, setStartDate] = useState(Date.now());

    const [schedules, setSchedules] = useAuthenticatedApi<GarbageCollectionSchedule[]>();
    const [garbageTypes, setGarbageTypes] = useAuthenticatedApi<GarbageType[]>();

    const updateSchedules = () => getBuildingDetailGarbageCollectionSchedules(session, setSchedules, buildingId);

    useEffect(() => {
        getGarbageTypesList(session, setGarbageTypes);
        updateSchedules();
    }, [buildingId]);

    const fancySchedules = () => schedules?.data.map((schedule) => ({
        id: schedule.id,
        note: schedule.note,
        garbage_type: garbageTypes?.data.find(({id}) => id === schedule.garbage_type),
        for_day: new Date(Date.parse(schedule.for_day))
    })) || [];

    function schedulesPerWeek() {
        const schedules = fancySchedules();
        const firstDay = new Date(Math.min(...schedules.map(({for_day}) => for_day.getTime())));
        const lastDay = new Date(Math.max(...schedules.map(({for_day}) => for_day.getTime())));
        firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
        lastDay.setDate(lastDay.getDate() + (8 - lastDay.getDay()));
        const perWeek = [];
        for (let monday = firstDay; monday <= lastDay;) {
            const nextMonday = new Date(monday);
            nextMonday.setDate(nextMonday.getDate() + 7);
            const sunday = new Date(monday);
            sunday.setDate(sunday.getDate() + 6);
            perWeek.push({
                monday,
                sunday,
                schedules: schedules
                    .filter(({for_day}) => for_day >= monday && for_day < nextMonday)
                    .sort((a, b) => a.for_day.getTime() - b.for_day.getTime()),
            })
            monday = nextMonday;
        }
        return (perWeek);
    }

    function dateFmt(date: Date) {
        const weekdays = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
        return `${weekdays[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`
    }

    return (<Box>
        <Typography variant='h5'>Planning</Typography>
        {schedules?.data && garbageTypes?.data ?
            <Box>
                {schedulesPerWeek().map(({monday, sunday, schedules}, index) =>
                    <Box key={index}>
                        <Box display={'flex'} alignItems={'center'}>
                            <Typography variant={'subtitle2'}>{dateFmt(monday)} tot {dateFmt(sunday)}</Typography>

                            <Box flexGrow={1}/>
                            <IconButton onClick={() => {
                            }} size={'small'}>
                                <Tooltip title={'Template plannen'}>
                                    <PlaylistAdd/>
                                </Tooltip>
                            </IconButton>
                            <IconButton onClick={() => {
                            }} size={'small'}>
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
                                        <IconButton size={'small'} onClick={() => {
                                        }}>
                                            <Edit/>
                                        </IconButton>
                                        <IconButton size={'small'} onClick={() => {
                                        }}>
                                            <Clear/>
                                        </IconButton>
                                    </Box>
                                </Box>) :
                            <Box paddingBottom={1}>
                                <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                                     paddingY={0.2} paddingX={'3%'} display={'flex'}>
                                    <Box flexGrow={1}/>
                                    <IconButton onClick={() => {
                                        schedulesPerWeek();
                                    }} size={'small'}>
                                        <Tooltip title={'Template plannen'}>
                                            <PlaylistAdd/>
                                        </Tooltip>
                                    </IconButton>
                                    <Box flexGrow={1}/>
                                    <IconButton onClick={() => {
                                    }} size={'small'}>
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
            </Box> :
            <LoadingElement/>
        }
    </Box>);
}
