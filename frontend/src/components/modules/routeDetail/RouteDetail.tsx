import {Box, Tooltip, Typography} from '@mui/material';
import BuildingList from '@/components/modules/routeDetail/BuildingList';
import React, {useEffect, useState} from 'react';
import RouteMap from '@/components/modules/routeDetail/RouteMap';
import {
    getBuildingsList,
    getLocationGroupDetail,
    getScheduleDefinitionDetail,
    getScheduleDefinitionDetailOrder, postScheduleDefinition,
    postScheduleDefinitionDetailOrder,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Building, ScheduleDefinition} from '@/api/models';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddBuildingPopup from '@/components/modules/routeDetail/AddBuildingPopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import ScheduleAssignmentList from '@/components/modules/routeDetail/ScheduleAssignmentList';
import styles from './routeDetails.module.css';

type routeDetailProps = {
    scheduleDefinitionId: ScheduleDefinition['id'] | null,
    updateList: (newSelected: number) => void,
}

function RouteDetail({scheduleDefinitionId, updateList}: routeDetailProps) {
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
        if (scheduleDefinitionId !== null && scheduleDefinitionId !== scheduleDefinition?.data?.id) {
            setScheduleDefinition(undefined);
            setOrder(undefined);
            getScheduleDefinitionDetail(session, (res) => {
                setScheduleDefinition(res);
                if (res.data) getLocationGroupDetail(session, setLocationGroup, res.data.location_group);
            }, scheduleDefinitionId);
            getScheduleDefinitionDetailOrder(session, setOrder, scheduleDefinitionId);
        }
    }, [session, scheduleDefinitionId]);

    function onReorder(newList: Building['id'][]) {
        const newOrder = newList.map((id, index) => ({building: id, position: index}));
        if (scheduleDefinition?.data) {
            postScheduleDefinition(session, {
                name: scheduleDefinition.data.name,
                version: scheduleDefinition.data.version + 1,
                location_group: scheduleDefinition.data.location_group,
            }, (res) => {
                setScheduleDefinition(res);
                if (res.data?.id) {
                    postScheduleDefinitionDetailOrder(session, res.data.id, newOrder, setOrder);
                    updateList(res.data.id);
                }
            });
        }
    }

    function onAdd() {
        setDialogOpen(true);
    }

    function onAdding(id: number | undefined) {
        setDialogOpen(false);
        if (id && scheduleDefinitionId && order) {
            const newOrder = order.data.concat({building: id, position: order.data.length});
            onReorder(newOrder.map(({building}) => building));
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
                (<Box width={'100%'} display={'flex'} flexDirection={'column'} overflow={'hidden'}>
                    <Box marginBottom={2} padding='20px' bgcolor={'var(--secondary-light)'}
                        borderRadius={'16px'}
                        display={'flex'} flexDirection={mobileView ? 'column' : 'row'}>
                        <Box display='flex' flexDirection='column' gap='10px'>
                            <Tooltip title={scheduleDefinition?.data.name} placement="top">
                                <h1 className={styles.building_data_title}>
                                    {scheduleDefinition?.data.name}
                                </h1>
                            </Tooltip>
                            <Tooltip title={locationGroup?.data.name} placement="right">
                                <p>{locationGroup?.data.name}</p>
                            </Tooltip>
                        </Box>
                        <Box flexGrow={1}>
                            <div style={{display: 'flex', flex: 1}}></div>
                            <Typography textAlign={mobileView ? 'start' : 'end'}>
                                <p>versie {scheduleDefinition?.data.version}</p>
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} gap={3} flex={1} overflow={'hidden'}
                        flexDirection={mobileView ? 'column' : 'row'}>
                        <Box flexGrow={2} flexBasis={0}>
                            <Typography variant={'h5'}>Gebouwen</Typography>
                            <BuildingList list={(orderedBuildings())}
                                onReorder={onReorder} onRemove={onRemove}
                                onAdd={onAdd}
                                onHovering={setHovering} hovering={hovering}/>
                        </Box>
                        <Box flexGrow={2} flexBasis={0}>
                            <ScheduleAssignmentList buildingId={scheduleDefinitionId}/>
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
            <LoadingElement/>
        );
    }
}

export default RouteDetail;

