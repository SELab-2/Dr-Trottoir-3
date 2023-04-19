import {MapContainer, Marker, TileLayer, Tooltip} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {latLngBounds, LatLngTuple} from 'leaflet';
import {useRouter} from 'next/router';
import {Building} from '@/api/models';

interface Props {
    buildings: Building[];
    onHovering: (hovering: Building['id'] | null) => void;
    hovering: Building['id'] | null;
}

function RouteMap({buildings, onHovering, hovering}: Props) {
    const router = useRouter();

    const markers = buildings.map(({name, id, latitude, longitude}, index) => {
        if (latitude != null && longitude != null) {
            return (
                <Marker key={index} position={[latitude, longitude]}
                        eventHandlers={{
                            mouseover: () => onHovering(id),
                            mouseout: () => onHovering(null),
                            click: () => router.push(`/buildings/${id}`),
                        }}>
                    {hovering === id && <Tooltip direction={'right'} permanent={true}>{name}</Tooltip>}
                </Marker>
            );
        }
    }).filter((item) => item !=== undefined);

    const coords: LatLngTuple[] = buildings
        .filter(({latitude, longitude}) => latitude != null && longitude != null)
        .map(({latitude, longitude}) => [latitude || 0, longitude || 0]);
    if (coords.length === 0) {
        coords.push([50.833341, 3.142672], [51.482056, 5.018877]);
    }
    const bounds = latLngBounds(coords);

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
