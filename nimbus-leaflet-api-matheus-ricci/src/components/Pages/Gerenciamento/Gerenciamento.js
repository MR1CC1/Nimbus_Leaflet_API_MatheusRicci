import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import L from "leaflet";
import ToolBar from '../../ToolBar/ToolBar';
import SideBar from '../../SideBar/SideBar';

const Gerenciamento = () => {
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });

    return (
        <div className='box'>
            <SideBar />
            <div className='header-map'>
                <div className='header'>

                    <h1>Ponto e Zoom Iniciais</h1>

                    <label>Latitude</label>
                    <input
                        type="number"
                    />

                    <label>Longitude</label>
                    <input
                        type="number"
                    />

                    <label>Zoom</label>
                    <input
                        type="number"
                    />

                    <button onClick={() => {
                    }}>
                        Salvar
                    </button>

                </div>
                <MapContainer center={{ lat: 2, lng: 1 }} zoom={1} scrollWheelZoom={true}>
                    <ToolBar />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>

            </div>

        </div>
    );
}

export default Gerenciamento