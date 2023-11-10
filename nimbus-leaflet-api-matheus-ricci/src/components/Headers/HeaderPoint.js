import React, { useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import ToolBar from '../ToolBar/ToolBar';
import '../SideBar/SideBar.css'

const HeaderPoint = () => {

    const [descPoint, SetDescPoint] = useState('')
    const [latPoint, SetLatPoint] = useState(0)
    const [lngPoint, SetLngPoint] = useState(0)

    const handleInputDesc = (e) => {
        SetDescPoint(e.target.value)
    }

    const handleInputLat = (e) => {
        SetLatPoint(e.target.value)
    }

    const handleInputLng = (e) => {
        SetLngPoint(e.target.value)
    }

    // Armazenando apenas o último marcador
    const [marker, setMarker] = useState(null);

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const newMarker = e.latlng;
                setMarker(newMarker);
                SetLatPoint(newMarker.lat);
                SetLngPoint(newMarker.lng);
            }
        });
        return null;
    }

    return (
        <div className='header-map'>
            <div className='header'>
                <h1>Novo Ponto</h1>
                {/* Inputs para descrição, latitude e longitude controlados pelo estado do React */}
                <label>Descrição</label>
                <input
                    type="text"
                    value={descPoint}
                    onChange={handleInputDesc}
                />
                <label>Latitude</label>
                <input
                    type="number"
                    value={latPoint}
                    onChange={handleInputLat}
                />
                <label>Longitude</label>
                <input
                    type="number"
                    value={lngPoint}
                    onChange={handleInputLng}
                />
                {/* Botão para salvar */}
                <button>
                    Salvar
                </button>
            </div>
            {/* MapContainer do react-leaflet para renderizar o mapa */}
            <MapContainer
                center={[10, 10]}
                zoom={13}
                scrollWheelZoom={true}
            >
                <ToolBar />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* Renderiza o último marcador */}
                {marker && <Marker position={marker}></Marker>}
                <MapClickHandler />
            </MapContainer>
        </div>
    )
}

export default HeaderPoint
