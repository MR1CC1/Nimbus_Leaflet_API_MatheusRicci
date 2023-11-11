import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import SideBar from '../../SideBar/SideBar';
import L from "leaflet";

const Visualizacao = () => {

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  });

  return (
    <div className='box'>
      <SideBar/>
      <div className='header-map'>
        <div className='header'>
          <h1>Visualização dos pontos e áreas de interesse</h1>
          <label>Label 1</label>
          <input
            type="number"
            name="lat"
          />
          <label>Label 2</label>
          <input
            type="number"
            name="lng"
          />
          <label>Label 3</label>
          <input
            type="number"
            name="zoom"
          />
          <button >
            Salvar
          </button>
        </div>
        <MapContainer
          center={{ lat: -22.914274, lng: -43.092566 }}
          zoom={12}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>
    </div>
  )
}

export default Visualizacao