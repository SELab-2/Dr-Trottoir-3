import {Box, Typography} from '@mui/material';
import BuildingList from '@/components/modules/routeDetail/BuildingList';
import {useEffect, useState} from 'react';
import RouteMap from '@/components/modules/routeDetail/RouteMap';
import {
    getBuildingsList,
    getLocationGroupDetail,
    getScheduleDefinitionDetail,
    getScheduleDefinitionDetailOrder,
    postScheduleDefinitionDetailOrder,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Building, ScheduleDefinition} from '@/api/models';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddBuildingPopup from '@/components/modules/routeDetail/AddBuildingPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';

type routeDetailProps = {
    scheduleDefinitionId: ScheduleDefinition['id'] | null,
}

function RouteDetail({scheduleDefinitionId}: routeDetailProps) {
    const {data: session} = useSession();
    const mobileView = useMediaQuery('(max-width:1000px)');
    const [hovering, setHovering] = useState<Building['id'] | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [scheduleDefinition, setScheduleDefinition] = useAuthenticatedApi<ScheduleDefinition>();
    const [locationGroup, setLocationGroup] = useAuthenticatedApi<ScheduleDefinition>();
    const [buildings, setBuildings] = useAuthenticatedApi<Building[]>();
    const [order, setOrder] = useAuthenticatedApi<{ building: Building['id'], position: number }[]>();
    const orderedBuildings: () => Building[] = () => order?.data
        .map(({building}) => (buildings?.data || [])
            .filter(({id}) => id == building))
        .flat() || [];

    useEffect(() => {
        getBuildingsList(session, setBuildings);
    }, [session]);

    useEffect(() => {
        if (scheduleDefinitionId !== null) {
            setScheduleDefinition(undefined);
            setOrder(undefined);
            getScheduleDefinitionDetail(session, (res) => {
                setScheduleDefinition(res);
                getLocationGroupDetail(session, setLocationGroup, res.data.location_group);
            }, scheduleDefinitionId);
            getScheduleDefinitionDetailOrder(session, setOrder, scheduleDefinitionId);
        }
    }, [session, scheduleDefinitionId]);

    function onReorder(newList: Building['id'][]) {
        const newOrder = newList.map((id, index) => ({building: id, position: index}));
        if (scheduleDefinitionId !== null) {
            postScheduleDefinitionDetailOrder(session, scheduleDefinitionId, newOrder, setOrder);
        }
    }

    function onAdd() {
        setDialogOpen(true);
    }

    function onAdding(id: number | undefined) {
        setDialogOpen(false);
        if (id && scheduleDefinitionId && order) {
            const newOrder = order.data.concat({building: id, position: order.data.length});
            postScheduleDefinitionDetailOrder(session, scheduleDefinitionId, newOrder, setOrder);
        }
    }

    function onRemove(buildingId: Building['id']) {
        onReorder(
            order?.data
                .map(({building}) => building)
                .filter((building) => building !== buildingId) || []
        );
    }

    if (scheduleDefinition && locationGroup && buildings && order) {
        return (
            scheduleDefinitionId !== null ?
                (<Box width={'100%'} display={'flex'} flexDirection={'column'} overflow={'auto'}>
                    <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'}
                        borderRadius={'var(--small_corner)'}
                        display={'flex'} flexDirection={mobileView ? 'column' : 'row'}>
                        <Box>
                            <Typography variant={mobileView ? 'h5' : 'h4'} onClick={() => console.log(buildings?.data)}
                                noWrap>{scheduleDefinition?.data.name}</Typography>
                            <Typography variant={'subtitle1'} noWrap>{locationGroup?.data.name}</Typography>
                        </Box>
                        <Box flexGrow={1}>
                            <Typography textAlign={mobileView ? 'start' : 'end'}>
                                Version: {scheduleDefinition?.data.version}
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} gap={1} flexGrow={1} flexDirection={mobileView ? 'column' : 'row'}>
                        <Box flexGrow={2} flexBasis={0}>
                            <Typography variant={'h5'}>Gebouwen</Typography>
                            <BuildingList list={(orderedBuildings())}
                                onReorder={onReorder} onRemove={onRemove}
                                onAdd={onAdd}
                                onHovering={setHovering} hovering={hovering}/>
                        </Box>
                        <Box flexGrow={5} minHeight={300}>
                            <RouteMap buildings={orderedBuildings()} onHovering={setHovering}
                                hovering={hovering}/>
                        </Box>
                    </Box>
                    {buildings && order ?
                        <AddBuildingPopup open={dialogOpen}
                            buildings={buildings.data
                                .filter(({id}) => !order.data.map(({building}) => building).includes(id))}
                            onClose={onAdding}/> : <></>}
                </Box>) :
                (<Box padding={1} width={'100%'} display={'flex'} flexDirection={'column'}>
                    <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'}
                        borderRadius={'var(--small_corner)'}
                        display={'flex'}>
                        <Box>
                            <Typography variant={mobileView ? 'h5' : 'h4'}>Geen route geselecteerd</Typography>
                            <Typography variant={'subtitle1'}>Selecteer een route om details weer te geven</Typography>
                        </Box>
                    </Box>
                </Box>));
    } else {
        return (
            <LoadingElement />
        );
    }
}

export default RouteDetail;

