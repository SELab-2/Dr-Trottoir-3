import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import {Map} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {createRef, useEffect} from 'react';

interface Props {
    longitude: number | null,
    latitude: number | null,
}


function BuildingMap({longitude, latitude}: Props) {
    const mapRef = createRef<Map>();
    useEffect(() => {
        if (latitude && longitude) {
            mapRef.current?.flyTo([latitude, longitude], 14);
        }
    }, [latitude, longitude]);

    return (
        <MapContainer style={{width: '100%', height: '100%'}} zoom={latitude && longitude ? 14 : 9} ref={mapRef}
                      center={latitude && longitude ? [latitude, longitude] : [51.1576985, 4.0807745]}>
            <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
            />
            {latitude && longitude ? <Marker position={[latitude, longitude]}/> : <></>}
        </MapContainer>
    );
}

export default BuildingMap;
