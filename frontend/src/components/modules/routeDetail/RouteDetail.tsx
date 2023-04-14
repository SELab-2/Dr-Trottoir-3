import {Box, Typography} from '@mui/material';
import BuildingList from '@/components/modules/routeDetail/BuildingList';
import {useEffect, useState} from 'react';
import RouteMap from '@/components/modules/routeDetail/RouteMap';

type routeDetailProps = {
    routeId: number | null,
}

function RouteDetail(props: routeDetailProps) {

    const [counter, setCounter] = useState(0);
    const [hovering, setHovering] = useState(-1);
    // const [list, setList] = useState([
    //     {id: 'A', name: 'Building A', lat: 51.025819, lon: 3.713635},
    //     {id: 'B', name: 'Building B', lat: 51.046237, lon: 3.725420},
    //     {id: 'C', name: 'Building C', lat: 51.036277, lon: 3.723558},
    //     {id: 'D', name: 'Building D', lat: 50.998364, lon: 3.766141},
    // ]);

    useEffect(() => {
        getBuildingList()
    })


    function onAdd() {
        const templist = Array.from(list);
        templist.push({id: counter.toString(), name: `Building ${counter}`, lat: 51.025819, lon: 3.713635});
        setList(templist);
        setCounter(counter + 1);
    }

    function onRemove(index: number) {
        const templist = Array.from(list);
        templist.splice(index, 1);
        setList(templist);
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
                    <BuildingList list={list} onReorder={setList} onRemove={onRemove} onAdd={onAdd}
                        onHovering={setHovering} hovering={hovering}/>
                </Box>
                <Box flexGrow={5}>
                    <RouteMap buildings={list} onHovering={setHovering} hovering={hovering}/>
                </Box>
            </Box>
        </Box>
    );
}

export default RouteDetail;

