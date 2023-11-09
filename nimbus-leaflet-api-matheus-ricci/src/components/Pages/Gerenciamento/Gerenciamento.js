import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from "leaflet";
import ToolBar from '../../ToolBar/ToolBar';
import SideBar from '../../SideBar/SideBar';
import axios from 'axios';

const Gerenciamento = () => {
    const [formData, setFormData] = useState({
        lat: 0,
        lng: 0,
        zoom: 0
    });

    const [mapPosition, setMapPosition] = useState([5, 0]);
    const [tempZoom, setTempZoom] = useState(formData.zoom);

    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                const response = await axios.get('http://localhost:3001/maps');
                const existingData = response.data[0];

                if (existingData) {
                    setFormData({
                        lat: existingData.lat,
                        lng: existingData.lng,
                        zoom: existingData.zoom,
                    });

                    setMapPosition([existingData.lat, existingData.lng]);
                }
            } catch (error) {
                console.error('Erro ao buscar dados da API:', error);
            }
        };

        fetchDataFromApi();
    }, []);

    const handleInputChange = (e) => {
        if (e.target.name === 'zoom') {
            setTempZoom(e.target.value);
        } else {
            setFormData({
                ...formData,
                [e.target.name]: parseFloat(e.target.value),
            });
        }
    };
    const handleSaveClick = async () => {
        const newFormData = {
            ...formData,
            zoom: parseFloat(tempZoom),
        };

        try {
            const response = await axios.get('http://localhost:3001/maps');
            const existingData = response.data;

            if (existingData.length > 0) {
                await axios.put(`http://localhost:3001/maps/${existingData[0].id}`, newFormData);
            } else {
                await axios.post('http://localhost:3001/maps', newFormData);
            }

            setFormData(newFormData);
            setMapPosition([newFormData.lat, newFormData.lng]);
            console.log('Dados enviados e estado atualizado com sucesso:', newFormData);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });

    return (
        <div className='box'>
            <SideBar />
            <div className='header-map'>
                <div className='header'>
                    <h1>Ponto e Zoom Iniciais</h1>
                    <label>lat</label>
                    <input
                        type="number"
                        name="lat"
                        value={formData.lat}
                        onChange={handleInputChange}
                    />
                    <label>lng</label>
                    <input
                        type="number"
                        name="lng"
                        value={formData.lng}
                        onChange={handleInputChange}
                    />
                    <label>Zoom</label>
                    <input
                        type="number"
                        name="zoom"
                        value={tempZoom}
                        onChange={handleInputChange}
                    />
                    <button onClick={handleSaveClick}>
                        Salvar
                    </button>
                </div>
                <MapContainer
                    center={mapPosition}
                    zoom={formData.zoom}
                    scrollWheelZoom={true}
                    key={`${mapPosition.join('_')}_${formData.zoom}`}
                >
                    <ToolBar />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </div>
        </div>
    );
};

export default Gerenciamento;
