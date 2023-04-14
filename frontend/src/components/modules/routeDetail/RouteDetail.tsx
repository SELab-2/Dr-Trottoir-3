import {Box, Typography} from '@mui/material';
import BuildingList from '@/components/modules/routeDetail/BuildingList';
import {useEffect, useState} from 'react';
import RouteMap from '@/components/modules/routeDetail/RouteMap';
import {deleteBuilding, getBuildingsList, postBuilding, useAuthenticatedApi} from '@/api/api';
import {useSession} from 'next-auth/react';
import {Building} from '@/api/models';

type routeDetailProps = {
    routeId: number | null,
}

function RouteDetail(props: routeDetailProps) {
    const {data: session} = useSession();

    const [counter, setCounter] = useState(0);
    const [hovering, setHovering] = useState(-1);
    const [list, setList] = useAuthenticatedApi<Building[]>();

    useEffect(() => {
        getBuildingsList(session, setList);
    }, [session]);


    function onAdd() {
        postBuilding(session,
            {
                id: counter.toString(),
                name: `Building ${counter}`,
                latitude: 51.025819,
                longitude: 3.713635,
            }
        );
        getBuildingsList(session, setList);
        setCounter(counter + 1);
    }

    function onRemove(id: number) {
        deleteBuilding(session, id);
        getBuildingsList(session, setList);
    }

    return (
        <Box padding={1} width={'100%'} display={'flex'} flexDirection={'column'}>
            <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                display={'flex'}>
                <Box>
                    <Typography variant={'h4'}>Route</Typography>
                    <Typography variant={'subtitle1'}>Gent</Typography>
                </Box>
                <Box flexGrow={1}>
                    <Typography textAlign={'end'}>Hovering {hovering}</Typography>
                </Box>
            </Box>
            <Box display={'flex'} gap={1} flexGrow={1}>
                <Box flexGrow={2} flexBasis={0}>
                    <Typography variant={'h5'}>Gebouwen</Typography>
                    <BuildingList list={list ? list.data : []} onReorder={setList} onRemove={onRemove} onAdd={onAdd}
                        onHovering={setHovering} hovering={hovering}/>
                </Box>
                <Box flexGrow={5}>
                    {list ? <RouteMap buildings={list.data} onHovering={setHovering} hovering={hovering}/> :
                        <div>No list data</div>
                    }
                </Box>
            </Box>
        </Box>
    );
}

export default RouteDetail;

