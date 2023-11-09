// Importações necessárias do React, biblioteca de mapas, ícones, axios para chamadas de API e componentes locais.
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from "leaflet";
import ToolBar from '../../ToolBar/ToolBar';
import SideBar from '../../SideBar/SideBar';
import axios from 'axios';


// Componente funcional Gerenciamento.
const Gerenciamento = () => {
    // Estado para armazenar e alterar os dados do formulário relacionados ao mapa (latitude, longitude e zoom).
    const [formData, setFormData] = useState({
        lat: 0,
        lng: 0,
        zoom: 0
    });

    // Estado para armazenar a posição atual do mapa.
    const [mapPosition, setMapPosition] = useState([-22.914274, -43.092566]);

    // Estado para armazenar temporariamente o valor do zoom antes de salvar.
    const [tempZoom, setTempZoom] = useState(formData.zoom);

    // Efeito que roda uma vez após a montagem do componente para buscar dados da API.
    useEffect(() => {
        const fetchDataFromApi = async () => {
            try {
                // Faz uma chamada GET para a API e armazena a resposta.
                const response = await axios.get('http://localhost:3001/maps');
                const existingData = response.data[0];

                // Se houver dados existentes, atualize os estados do formulário e da posição do mapa.
                if (existingData) {
                    setFormData({
                        lat: existingData.lat,
                        lng: existingData.lng,
                        zoom: existingData.zoom,
                    });

                    setMapPosition([existingData.lat, existingData.lng]);
                }
            } catch (error) {
                // Em caso de erro na chamada da API, logue o erro no console.
                console.error('Erro ao buscar dados da API:', error);
            }
        };

        fetchDataFromApi();
    }, []); // A array de dependências vazia garante que o efeito só roda uma vez.

    // Manipulador de eventos para lidar com mudanças nos inputs do formulário.
    const handleInputChange = (e) => {
        if (e.target.name === 'zoom') {
            // Para o campo zoom, atualize o estado tempZoom.
            setTempZoom(e.target.value);
        } else {
            // Para outros campos, atualize o estado formData.
            setFormData({
                ...formData,
                [e.target.name]: parseFloat(e.target.value),
            });
        }
    };

    // Manipulador de eventos para lidar com o clique no botão salvar.
    const handleSaveClick = async () => {
        // Prepara novos dados do formulário com o valor atualizado do zoom.
        const newFormData = {
            ...formData,
            zoom: parseFloat(tempZoom),
        };

        try {
            // Verifica se já existem dados salvos na API.
            const response = await axios.get('http://localhost:3001/maps');
            const existingData = response.data;

            // Se existirem dados, atualize-os com PUT; senão, crie novos com POST.
            if (existingData.length > 0) {
                await axios.put(`http://localhost:3001/maps/${existingData[0].id}`, newFormData);
            } else {
                await axios.post('http://localhost:3001/maps', newFormData);
            }

            // Atualize os estados formData e mapPosition com os novos dados.
            setFormData(newFormData);
            setMapPosition([newFormData.lat, newFormData.lng]);
            // Logue no console que os dados foram enviados com sucesso.
            console.log('Dados enviados e estado atualizado com sucesso:', newFormData);
        } catch (error) {
            // Em caso de erro ao enviar dados, logue o erro no console.
            console.error('Erro ao enviar dados:', error);
        }
    };

    // Configuração global dos ícones do Leaflet usados para marcadores no mapa.
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });

    // JSX que define o que será renderizado na tela: Sidebar, campos do formulário e o MapContainer.
    return (
        <div className='box'>
            <SideBar />
            <div className='header-map'>
                <div className='header'>
                    <h1>Ponto e Zoom Iniciais</h1>
                    {/* Inputs para lat, lng e zoom controlados pelo estado do React */}
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
                    {/* Botão que, ao ser clicado, chama o manipulador de eventos para salvar os dados */}
                    <button onClick={handleSaveClick}>
                        Salvar
                    </button>
                </div>
                {/* MapContainer do react-leaflet para renderizar o mapa */}
                <MapContainer
                    center={mapPosition}
                    zoom={formData.zoom}
                    scrollWheelZoom={true}
                    key={`${mapPosition.join('_')}_${formData.zoom}`}
                >
                    {/* ToolBar pode ser um componente personalizado para controle do mapa */}
                    <ToolBar />
                    {/* TileLayer é o componente que renderiza as imagens do mapa */}
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                </MapContainer>
            </div>
        </div>
    );
};

export default Gerenciamento; // Exporta o componente para ser usado em outras partes da aplicação.
