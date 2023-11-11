import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Importe a biblioteca Leaflet
import '../SideBar/SideBar.css';

const HeaderPerimeters = () => {
    const [circleCenter, setCircleCenter] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [circleRadius, setCircleRadius] = useState(200); // Raio inicial em metros

    // Manipuladores de evento para atualizar o centro e o raio do círculo
    const handleLatChange = (e) => {
        const newLat = parseFloat(e.target.value);
        if (circleCenter && !isNaN(newLat)) {
            setCircleCenter(L.latLng(newLat, circleCenter.lng));
        }
    };

    const handleLngChange = (e) => {
        const newLng = parseFloat(e.target.value);
        if (circleCenter && !isNaN(newLng)) {
            setCircleCenter(L.latLng(circleCenter.lat, newLng));
        }
    };

    const handleRadiusChange = (e) => {
        setCircleRadius(parseFloat(e.target.value));
    };

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!isDrawing) {
                    setCircleCenter(e.latlng);
                    setCircleRadius(200);
                    setIsDrawing(true);
                } else {
                    setIsDrawing(false);
                }
            },
            mousemove(e) {
                if (isDrawing && circleCenter) {
                    const newRadius = circleCenter.distanceTo(e.latlng);
                    setCircleRadius(newRadius);
                }
            }
        });
        return null;
    }

    return (
        <div className='header-map'>
            <div className='header'>
                <h1>Novo Perímetro</h1>
                {/* Inputs para descrição, latitude, longitude e raio */}
                <label>Descrição</label>
                <input type="text" />
                <label>Latitude</label>
                <input type="number" value={circleCenter ? circleCenter.lat : ''} onChange={handleLatChange} />
                <label>Longitude</label>
                <input type="number" value={circleCenter ? circleCenter.lng : ''} onChange={handleLngChange} />
                <label>Raio (metros)</label>
                <input type="number" value={circleRadius} onChange={handleRadiusChange} />
                <button>Salvar</button>
            </div>
            <MapContainer center={[10, 10]} zoom={13} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {circleCenter && <Circle center={circleCenter} radius={circleRadius} />}
                <MapClickHandler />
            </MapContainer>
        </div>
    );
}

export default HeaderPerimeters;
