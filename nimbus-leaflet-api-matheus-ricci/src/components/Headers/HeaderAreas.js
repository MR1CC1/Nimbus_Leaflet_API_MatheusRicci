import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// Componente para lidar com eventos do mapa
const MapEventHandler = ({ onMapClick, onMapMouseMove, drawing }) => {
    useMapEvents({
        click: onMapClick, // Define o que acontece ao clicar no mapa. 'onMapClick' é passado como prop.
        mousemove: drawing ? onMapMouseMove : undefined, // Define o evento de movimento do mouse, só ativo se 'drawing' for verdadeiro.
    });
    return null; // Este componente não renderiza nada visualmente.
};

// Componente principal para criar áreas no mapa
const HeaderAreas = (props) => {
    // Estados para gerenciar a descrição da área, limites, se está desenhando e o ponto inicial.
    const [description, setDescription] = useState('');
    const [bounds, setBounds] = useState(null);
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);

    // Manipula mudanças na latitude (norte/sul) da área
    const handleLatChange = useCallback((which, value) => {
        if (!bounds) return;
        // Define a nova latitude norte ou sul com base no input do usuário.
        const north = which === 'north' ? value : bounds.getNorth();
        const south = which === 'south' ? value : bounds.getSouth();
        // Atualiza os limites da área.
        setBounds(L.latLngBounds([north, bounds.getWest()], [south, bounds.getEast()]));
    }, [bounds]);

    // Manipula mudanças na longitude (oeste/leste) da área
    const handleLngChange = useCallback((which, value) => {
        if (!bounds) return;
        // Define a nova longitude oeste ou leste com base no input do usuário.
        const west = which === 'west' ? value : bounds.getWest();
        const east = which === 'east' ? value : bounds.getEast();
        // Atualiza os limites da área.
        setBounds(L.latLngBounds([bounds.getNorth(), west], [bounds.getSouth(), east]));
    }, [bounds]);

    // Manipula clique no mapa
    const handleMapClick = useCallback((e) => {
        if (!drawing) {
            // Inicia o desenho definindo o ponto inicial e os limites.
            setDrawing(true);
            setStartPoint(e.latlng);
            setBounds(L.latLngBounds(e.latlng, e.latlng));
        } else {
            // Finaliza o desenho.
            setDrawing(false);
            setStartPoint(null);
        }
    }, [drawing]);

    // Salva os dados da área no servidor
    const saveArea = async () => {
        if (!bounds) return;

        // Prepara os dados da área para envio.
        const areaData = {
            description: description,
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            west: bounds.getWest(),
            east: bounds.getEast()
        };

        // Faz a requisição POST para salvar os dados.
        try {
            const response = await fetch('http://localhost:3001/areas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(areaData),
            });

            if (response.ok) {
                toast.success('Área Salva com Sucesso!', {
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
            toast.error('Erro ao Salvar a Área!', {
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

    // Manipula o movimento do mouse no mapa durante o desenho
    const handleMapMouseMove = useCallback((e) => {
        if (drawing && startPoint) {
            // Calcula os novos limites da área enquanto o usuário move o mouse.
            const north = Math.max(startPoint.lat, e.latlng.lat);
            const south = Math.min(startPoint.lat, e.latlng.lat);
            const west = Math.min(startPoint.lng, e.latlng.lng);
            const east = Math.max(startPoint.lng, e.latlng.lng);
            setBounds(L.latLngBounds([north, west], [south, east]));
        }
    }, [drawing, startPoint]);

    // Renderiza o componente
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
                <h1>{props.mode} Área</h1>
                {/* Campos de entrada para descrição e coordenadas da área */}
                <label>Descrição</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
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
                    window.location.reload()
                }}>Salvar</button>
            </div>
            {/* Container do mapa com camada de tiles e retângulo representando a área selecionada */}
            <MapContainer center={[10, 10]} zoom={13} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {bounds && <Rectangle bounds={bounds} />}
                <MapEventHandler onMapClick={handleMapClick} onMapMouseMove={handleMapMouseMove} drawing={drawing} />
            </MapContainer>
        </div>
    );
}

export default HeaderAreas;
