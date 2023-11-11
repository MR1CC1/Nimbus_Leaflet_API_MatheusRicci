import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import '../SideBar/SideBar.css';

const HeaderPoint = () => {
    const [descPoint, SetDescPoint] = useState('');
    const [latPoint, SetLatPoint] = useState(0);
    const [lngPoint, SetLngPoint] = useState(0);
    const [marker, setMarker] = useState(null);

    const handleInputDesc = (e) => {
        SetDescPoint(e.target.value);
    };

    const handleInputLat = (e) => {
        const newLat = parseFloat(e.target.value);
        SetLatPoint(newLat);
        if (!isNaN(newLat) && !isNaN(lngPoint)) {
            setMarker({ lat: newLat, lng: lngPoint });
        }
    };

    const handleInputLng = (e) => {
        const newLng = parseFloat(e.target.value);
        SetLngPoint(newLng);
        if (!isNaN(latPoint) && !isNaN(newLng)) {
            setMarker({ lat: latPoint, lng: newLng });
        }
    };

    useEffect(() => {
        if (latPoint && lngPoint) {
            setMarker({ lat: latPoint, lng: lngPoint });
        }
    }, [latPoint, lngPoint]);

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const newMarker = e.latlng;
                setMarker(newMarker);
                SetLatPoint(newMarker.lat);
                SetLngPoint(newMarker.lng);
            },
        });
        return null;
    }

    return (
        <div className='header-map'>
            <div className='header'>
                <h1>Novo Ponto</h1>
                <label>Descrição</label>
                <input
                    type="text"
                    value={descPoint}
                    onChange={handleInputDesc}
                />
                <label>Latitude</label>
                <input
                    type="number"
                    value={latPoint || ''}
                    onChange={handleInputLat}
                />
                <label>Longitude</label>
                <input
                    type="number"
                    value={lngPoint || ''}
                    onChange={handleInputLng}
                />
                <button>
                    Salvar
                </button>
            </div>
            <MapContainer
                center={[10, 10]}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {marker && <Marker position={marker}></Marker>}
                <MapClickHandler />
            </MapContainer>
        </div>
    );
}

export default HeaderPoint;
