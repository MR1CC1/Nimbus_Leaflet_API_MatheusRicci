import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import ToolBar from '../ToolBar/ToolBar';
import '../SideBar/SideBar.css'

const HeaderPerimeters = () => {
    return (
        <div className='header-map'>
            <div className='header'>
                <h1>Novo Perímetro</h1>
                {/* Inputs para lat, lng e zoom controlados pelo estado do React */}
                <label>Descrição</label>
                <input
                    type="text"
                />
                <label>Latitude</label>
                <input
                    type="number"
                />
                <label>Longitude</label>
                <input
                    type="number"
                />
                <label>Raio (KM)</label>
                <input
                    type="number"
                />
                {/* Botão que, ao ser clicado, chama o manipulador de eventos para salvar os dados */}
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
                {/* ToolBar pode ser um componente personalizado para controle do mapa */}
                <ToolBar />
                {/* TileLayer é o componente que renderiza as imagens do mapa */}
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </MapContainer>
        </div>
    )
}

export default HeaderPerimeters