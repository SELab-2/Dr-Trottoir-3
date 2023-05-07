import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {LatLng, Map} from 'leaflet';
import {createRef, useEffect} from 'react';

interface Props {
    coordinate: LatLng,
    setCoordinate: (coordinate: LatLng) => void,
}


function BuildingMap({coordinate, setCoordinate}: Props) {
    const mapRef = createRef<Map>();

    useEffect(() => {
        mapRef.current?.flyTo(coordinate);
    }, [coordinate]);

    return (
        <MapContainer style={{width: '100%', height: '100%'}} zoom={13}
            center={coordinate} ref={mapRef}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            <Marker position={coordinate} draggable eventHandlers={{
                dragend: (e) => {
                    setCoordinate(e.target.getLatLng());
                },
            }}/>
        </MapContainer>
    );
}

export default BuildingMap;
