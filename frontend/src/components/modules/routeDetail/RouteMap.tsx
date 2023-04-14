import {MapContainer, Marker, TileLayer, Tooltip} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {latLngBounds} from 'leaflet';
import {Building} from './types';
import {useRouter} from 'next/router';

interface Props {
    buildings: Building[];
    onHovering: (hovering: number) => void;
    hovering: number;
}

function RouteMap({buildings, onHovering, hovering}: Props) {
    const router = useRouter();

    const markers = buildings.map(({name, id, lat, lon}, index) => (
        <Marker key={index} position={[lat, lon]}
            eventHandlers={{
                mouseover: () => onHovering(index),
                mouseout: () => onHovering(-1),
                click: () => router.push(`/buildings/${id}`),
            }}>
            {hovering == index && <Tooltip direction={'right'} permanent={true}>{name}</Tooltip>}
        </Marker>
    ));

    const bounds = latLngBounds(buildings.map(({lat, lon}) => [lat, lon]));

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
