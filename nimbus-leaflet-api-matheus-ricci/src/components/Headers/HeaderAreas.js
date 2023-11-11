import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const MapEventHandler = ({ onMapClick, onMapMouseMove, drawing }) => {
    useMapEvents({
        click: onMapClick,
        mousemove: drawing ? onMapMouseMove : undefined,
    });
    return null;
};

const HeaderAreas = () => {
    const [bounds, setBounds] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);

    const handleLatChange = useCallback((which, value) => {
        if (!bounds) return;

        const north = which === 'north' ? value : bounds.getNorth();
        const south = which === 'south' ? value : bounds.getSouth();

        setBounds(L.latLngBounds([north, bounds.getWest()], [south, bounds.getEast()]));
    }, [bounds]);

    const handleLngChange = useCallback((which, value) => {
        if (!bounds) return;

        const west = which === 'west' ? value : bounds.getWest();
        const east = which === 'east' ? value : bounds.getEast();

        setBounds(L.latLngBounds([bounds.getNorth(), west], [bounds.getSouth(), east]));
    }, [bounds]);

    const handleMapClick = useCallback((e) => {
        if (!drawing) {
            setDrawing(true);
            setStartPoint(e.latlng);
            setBounds(L.latLngBounds(e.latlng, e.latlng));
        } else {
            setDrawing(false);
            setStartPoint(null);
        }
    }, [drawing]);

    const handleMapMouseMove = useCallback((e) => {
        if (drawing && startPoint) {
            const north = Math.max(startPoint.lat, e.latlng.lat);
            const south = Math.min(startPoint.lat, e.latlng.lat);
            const west = Math.min(startPoint.lng, e.latlng.lng);
            const east = Math.max(startPoint.lng, e.latlng.lng);

            setBounds(L.latLngBounds([north, west], [south, east]));
        }
    }, [drawing, startPoint]);

    return (
        <div className='header-map'>
            <div className='header'>
                <h1>Nova Área</h1>
                <label>Latitude Superior</label>
                <input type="number" value={bounds ? bounds.getNorth() : ''} onChange={(e) => handleLatChange('north', parseFloat(e.target.value))} />
                <label>Latitude Inferior</label>
                <input type="number" value={bounds ? bounds.getSouth() : ''} onChange={(e) => handleLatChange('south', parseFloat(e.target.value))} />
                <label>Longitude Esquerda</label>
                <input type="number" value={bounds ? bounds.getWest() : ''} onChange={(e) => handleLngChange('west', parseFloat(e.target.value))} />
                <label>Longitude Direita</label>
                <input type="number" value={bounds ? bounds.getEast() : ''} onChange={(e) => handleLngChange('east', parseFloat(e.target.value))} />
                <button>Salvar</button>
            </div>
            <MapContainer center={[10, 10]} zoom={13} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {bounds && <Rectangle bounds={bounds} />}
                <MapEventHandler onMapClick={handleMapClick} onMapMouseMove={handleMapMouseMove} drawing={drawing} />
            </MapContainer>
        </div>
    );
}

export default HeaderAreas;
