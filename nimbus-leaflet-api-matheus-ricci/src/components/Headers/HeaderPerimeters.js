import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import ToolBar from '../ToolBar/ToolBar';
import '../SideBar/SideBar.css';

const HeaderPerimeters = () => {
    const [circleCenter, setCircleCenter] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [circleRadius, setCircleRadius] = useState(200); // Raio inicial em metros

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!isDrawing) {
                    // Inicia o desenho do círculo
                    setCircleCenter(e.latlng);
                    setCircleRadius(200); // Reseta o raio para o valor inicial
                    setIsDrawing(true);
                } else {
                    // Finaliza o desenho do círculo
                    setIsDrawing(false);
                }
            },
            mousemove(e) {
                if (isDrawing && circleCenter) {
                    // Atualiza o raio do círculo com base na posição do mouse
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
                <input type="number" value={circleCenter ? circleCenter.lat : ''} readOnly />
                <label>Longitude</label>
                <input type="number" value={circleCenter ? circleCenter.lng : ''} readOnly />
                <label>Raio (metros)</label>
                <input type="number" value={circleRadius} readOnly />
                {/* Botão para salvar */}
                <button>Salvar</button>
            </div>
            {/* MapContainer do react-leaflet para renderizar o mapa */}
            <MapContainer
                center={[10, 10]}
                zoom={13}
                scrollWheelZoom={true}
            >
                <ToolBar />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {circleCenter && <Circle center={circleCenter} radius={circleRadius} />}
                <MapClickHandler />
            </MapContainer>
        </div>
    )
}

export default HeaderPerimeters;
