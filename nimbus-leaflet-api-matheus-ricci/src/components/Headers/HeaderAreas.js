// Importando os hooks e componentes do React e bibliotecas relacionadas
import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet'; // Componentes para criar o mapa
import L from 'leaflet'; // Biblioteca Leaflet para manipulação de mapas
import { ToastContainer, toast } from 'react-toastify'; // Componentes para notificações
import 'react-toastify/dist/ReactToastify.css'; // Estilos para as notificações

// Componente para lidar com eventos do mapa
const MapEventHandler = ({ onMapClick, onMapMouseMove, drawing }) => {
    // Registra eventos de clique e movimento do mouse no mapa
    useMapEvents({
        click: onMapClick,
        mousemove: drawing ? onMapMouseMove : undefined,
    });
    return null; // Não renderiza nenhum elemento visual
};

// Componente principal para gerenciar áreas no mapa
const HeaderAreas = ({ mode, id, description, north, south, west, east }) => {
    // Estados para a descrição, limites da área, estado de desenho e ponto inicial
    const [desc, setDesc] = useState(description || '');
    const [bounds, setBounds] = useState(
        north && south && west && east ? L.latLngBounds([[north, west], [south, east]]) : null
    );
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);

    // Atualiza estados com base nas props recebidas
    useEffect(() => {
        setDesc(description || '');
        if (north && south && west && east) {
            setBounds(L.latLngBounds([[north, west], [south, east]]));
        }
    }, [description, north, south, west, east]);

    // Funções callback para lidar com alterações na latitude e longitude
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

    // Funções callback para manipulação de cliques e movimento do mouse no mapa
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

    // Função para salvar a área
    const saveArea = async () => {
        if (!bounds) return;

        // Preparando dados da área para envio
        const areaData = {
            description: desc,
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            west: bounds.getWest(),
            east: bounds.getEast()
        };

        // Tentativa de salvar a área via API
        try {
            let response;
            if (mode === "Editar") {
                // Atualizar área existente
                response = await fetch(`http://localhost:3001/areas/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(areaData),
                });
            } else {
                // Criar nova área
                response = await fetch('http://localhost:3001/areas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(areaData),
                });
            }

            // Exibindo notificação de sucesso ou erro
            if (response.ok) {
                toast.success(`${mode === "Editar" ? 'Área Atualizada' : 'Área Salva'} com Sucesso!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (error) {
            toast.error(`Erro ao ${mode === "Editar" ? 'Atualizar' : 'Salvar'} a Área!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    // Renderização do componente
    return (
        <div className='header-map'>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                limit={2}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className='header'>
                <h1>{mode} Área</h1>
                <label>Descrição</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
                <label>Latitude Superior</label>
                <input type="number" value={bounds ? bounds.getNorth() : ''} onChange={(e) => handleLatChange('north', parseFloat(e.target.value))} />
                <label>Latitude Inferior</label>
                <input type="number" value={bounds ? bounds.getSouth() : ''} onChange={(e) => handleLatChange('south', parseFloat(e.target.value))} />
                <label>Longitude Esquerda</label>
                <input type="number" value={bounds ? bounds.getWest() : ''} onChange={(e) => handleLngChange('west', parseFloat(e.target.value))} />
                <label>Longitude Direita</label>
                <input type="number" value={bounds ? bounds.getEast() : ''} onChange={(e) => handleLngChange('east', parseFloat(e.target.value))} />
                <button onClick={() => {
                    saveArea()
                    setTimeout(() => {
                        window.location.reload()
                    }, 3500);
                }
                }>Salvar</button>
            </div>
            <MapContainer center={[-22.9069557612611, -43.23988648507283]} zoom={11} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {bounds && <Rectangle bounds={bounds} />}
                <MapEventHandler onMapClick={handleMapClick} onMapMouseMove={handleMapMouseMove} drawing={drawing} />
            </MapContainer>
        </div>
    );
}

// Exportando o componente para uso em outros locais
export default HeaderAreas;
