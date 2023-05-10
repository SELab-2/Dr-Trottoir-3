import {MapContainer, Marker, TileLayer, Tooltip} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {latLngBounds, LatLngTuple, Map} from 'leaflet';
import {Building} from '@/api/models';
import {createRef, useEffect} from 'react';

interface Props {
    buildings: Building[];
    onHovering: (hovering: Building['id'] | null) => void;
    hovering: Building['id'] | null;
}

function RouteMap({buildings, onHovering, hovering}: Props) {
    const mapRef = createRef<Map>();

    const markers = buildings.map(({name, id, latitude, longitude}, index) => {
        if (latitude && longitude) {
            return (
                <Marker key={index} position={[latitude, longitude]}
                    eventHandlers={{
                        mouseover: () => onHovering(id),
                        mouseout: () => onHovering(null),
                    }}>
                    {hovering === id && <Tooltip direction={'right'} permanent={true}>{name}</Tooltip>}
                </Marker>
            );
        }
    }).filter((item) => item !== undefined);

    function getBounds() {
        const coords: LatLngTuple[] = buildings
            .filter(({latitude, longitude}) => latitude && longitude)
            .map(({latitude, longitude}) => [latitude || 0, longitude || 0]);
        if (coords.length === 0) {
            coords.push([50.833341, 3.142672], [51.482056, 5.018877]);
            return latLngBounds(coords);
        }
        return latLngBounds(coords).pad(1);
    }

    useEffect(() => {
        mapRef.current?.flyToBounds(getBounds());
    }, [buildings]);

    return (
        <MapContainer style={{width: '100%', height: '100%'}} bounds={getBounds()} ref={mapRef}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            {markers}
        </MapContainer>
    );
}

export default RouteMap;
