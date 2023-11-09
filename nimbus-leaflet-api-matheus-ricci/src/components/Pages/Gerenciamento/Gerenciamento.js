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
    }, []); // Dependências vazias para rodar apenas uma vez

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: parseFloat(e.target.value),
        });
    };
    const handleSaveClick = async () => {
        try {
            const response = await axios.get('http://localhost:3001/maps');
            const existingData = response.data;

            if (existingData.length > 0) {
                // Se já existe um mapa salvo, atualizamos os dados
                await axios.put(`http://localhost:3001/maps/${existingData[0].id}`, formData);
            } else {
                // Se não existe um mapa, criamos um novo
                await axios.post('http://localhost:3001/maps', formData);
            }

            // Atualize o estado com os dados do formulário, que presumivelmente foram salvos corretamente
            setMapPosition([formData.lat, formData.lng]);
            console.log('Dados enviados e estado atualizado com sucesso:', formData);
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
        }
    };

    // No restante do componente...



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
                        value={formData.zoom}
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
                    key={mapPosition.join('_')} // chave única baseada na posição do mapa
                >
                    <ToolBar />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </div>
        </div>
    );
};

export default Gerenciamento;
