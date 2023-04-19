import {Box, Typography} from '@mui/material';
import BuildingList from '@/components/modules/routeDetail/BuildingList';
import {useEffect, useState} from 'react';
import RouteMap from '@/components/modules/routeDetail/RouteMap';
import {getScheduleDefinitionDetail, getScheduleDefinitionDetailBuildings, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Building, ScheduleDefinition} from '@/api/models';

type routeDetailProps = {
    scheduleDefinitionId: ScheduleDefinition['id'] | null,
}

function RouteDetail({scheduleDefinitionId}: routeDetailProps) {
    const {data: session} = useSession();

    const [hovering, setHovering] = useState<Building['id'] | null>(null);
    const [scheduleDefinition, setScheduleDefinition] = useAuthenticatedApi<ScheduleDefinition>();
    const [list, setList] = useAuthenticatedApi<Building[]>();

    useEffect(() => {
        if (scheduleDefinitionId !=== null) {
            setScheduleDefinition(undefined);
            setList(undefined);
            getScheduleDefinitionDetail(session, setScheduleDefinition, scheduleDefinitionId);
            getScheduleDefinitionDetailBuildings(session, setList, scheduleDefinitionId);
        }
    }, [session, scheduleDefinitionId]);

    function onReorder(newList: Building['id'][]) {
        // if (schedule_definition_id !=== null) {
        //     patchScheduleDefinitionDetail(session, schedule_definition_id, {buildings: newList}, (...args) => {
        //         setScheduleDefinition(...args);
        //         getScheduleDefinitionDetailBuildings(session, setList, schedule_definition_id);
        //     });
        //
        // }
        console.error('Not implemented');
    }

    function onAdd() {
        console.error('Not implemented');
    }

    function onRemove(buildingId: Building['id']) {
        console.error('Not implemented');
    }

    return (
        scheduleDefinitionId !=== null ?
            (<Box padding={1} width={'100%'} display={'flex'} flexDirection={'column'}>
                <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'}
                     borderRadius={'var(--small_corner)'}
                     display={'flex'}>
                    <Box>
                        <Typography variant={'h4'}>{scheduleDefinition?.data.name}</Typography>
                        <Typography variant={'subtitle1'}>{scheduleDefinition?.data.location_group}</Typography>
                    </Box>
                    <Box flexGrow={1}>
                        <Typography textAlign={'end'}>ID: {scheduleDefinitionId},
                            Hovering {hovering ? hovering : 'nothing'}</Typography>
                    </Box>
                </Box>
                <Box display={'flex'} gap={1} flexGrow={1}>
                    <Box flexGrow={2} flexBasis={0}>
                        <Typography variant={'h5'}>Gebouwen</Typography>
                        <BuildingList list={list ? list.data : []} onReorder={onReorder} onRemove={onRemove}
                                      onAdd={onAdd}
                                      onHovering={setHovering} hovering={hovering}/>
                    </Box>
                    <Box flexGrow={5}>
                        {list ? <RouteMap buildings={list.data} onHovering={setHovering} hovering={hovering}/> :
                            <div>No list data</div>
                        }
                    </Box>
                </Box>
            </Box>) :
            (<Box padding={1} width={'100%'} display={'flex'} flexDirection={'column'}>
                <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'}
                     borderRadius={'var(--small_corner)'}
                     display={'flex'}>
                    <Box>
                        <Typography variant={'h4'}>Geen route geselecteerd</Typography>
                        <Typography variant={'subtitle1'}>Selecteer een route om details weer te geven</Typography>
                    </Box>
                </Box>
            </Box>));
}

export default RouteDetail;

