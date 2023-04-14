import {MapContainer, Marker, TileLayer, Tooltip} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {latLngBounds} from 'leaflet';
import {useRouter} from 'next/router';
import {Building} from '@/api/models';

interface Props {
    buildings: Building[];
    onHovering: (hovering: number) => void;
    hovering: number;
}

function RouteMap({buildings, onHovering, hovering}: Props) {
    const router = useRouter();

    const markers = buildings.map(({name, id, latitude, longitude}, index) => {
        if (latitude != null && longitude != null) {
            return (
                <Marker key={index} position={[latitude, longitude]}
                    eventHandlers={{
                        mouseover: () => onHovering(index),
                        mouseout: () => onHovering(-1),
                        click: () => router.push(`/buildings/${id}`),
                    }}>
                    {hovering == index && <Tooltip direction={'right'} permanent={true}>{name}</Tooltip>}
                </Marker>
            );
        } else {
            return (<></>);
        }
    });

    const bounds = latLngBounds(buildings
        .filter(({latitude, longitude}) => latitude != null && longitude != null)
        .map(({latitude, longitude}) => {
            if (latitude != null && longitude != null) {
                return [latitude, longitude];
            } else {
            // will never be reached
                return [1, 1];
            }
        }));


    console.log(bounds);

    return (
        <MapContainer style={{width: '100%', height: '100%'}} bounds={bounds}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            {markers}
        </MapContainer>
    );
}

export default RouteMap;
