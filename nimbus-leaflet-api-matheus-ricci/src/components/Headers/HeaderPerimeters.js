import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Importando a biblioteca Leaflet para manipulação de mapas
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const HeaderPerimeters = (props) => {
    // Estados para armazenar a descrição, o centro do círculo, se está desenhando e o raio do círculo
    const [description, setDescription] = useState('');
    const [circleCenter, setCircleCenter] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [circleRadius, setCircleRadius] = useState(200); // Raio inicial em metros

    // Função para salvar o perímetro no servidor
    const savePerimeter = async () => {
        if (!circleCenter) return;

        // Prepara os dados do perímetro para envio
        const perimeterData = {
            description: description,
            centerLat: circleCenter.lat,
            centerLng: circleCenter.lng,
            radius: circleRadius
        };

        // Faz a requisição POST para salvar os dados
        try {
            const response = await fetch('http://localhost:3001/perimeters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(perimeterData),
            });

            if (response.ok) {
                toast.success('Perímetro Salvo com Sucesso!', {
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
            toast.error('Erro ao Salvar o Perímetro!', {
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

    // Funções para manipular mudanças nos inputs de latitude, longitude e raio
    const handleLatChange = (e) => {
        const newLat = parseFloat(e.target.value);
        if (circleCenter && !isNaN(newLat)) {
            setCircleCenter(L.latLng(newLat, circleCenter.lng));
        }
    };

    const handleLngChange = (e) => {
        const newLng = parseFloat(e.target.value);
        if (circleCenter && !isNaN(newLng)) {
            setCircleCenter(L.latLng(circleCenter.lat, newLng));
        }
    };

    const handleRadiusChange = (e) => {
        setCircleRadius(parseFloat(e.target.value));
    };

    // Componente para lidar com eventos do mapa
    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!isDrawing) {
                    // Define o centro do círculo e começa a desenhar
                    setCircleCenter(e.latlng);
                    setCircleRadius(200);
                    setIsDrawing(true);
                } else {
                    // Finaliza o desenho
                    setIsDrawing(false);
                }
            },
            mousemove(e) {
                if (isDrawing && circleCenter) {
                    // Atualiza o raio do círculo enquanto o mouse se move
                    const newRadius = circleCenter.distanceTo(e.latlng);
                    setCircleRadius(newRadius);
                }
            }
        });
        return null; // Este componente não renderiza nada visualmente
    }

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
                <h1>{props.mode} Perímetro</h1>
                {/* Campos de entrada para descrição, latitude, longitude e raio */}
                <label>Descrição</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                <label>Latitude</label>
                <input type="number" value={circleCenter ? circleCenter.lat : ''} onChange={handleLatChange} />
                <label>Longitude</label>
                <input type="number" value={circleCenter ? circleCenter.lng : ''} onChange={handleLngChange} />
                <label>Raio (metros)</label>
                <input type="number" value={circleRadius} onChange={handleRadiusChange} />
                <button onClick={() => {
                    savePerimeter()
                    window.location.reload()
                }}>Salvar</button>
            </div>
            {/* Container do mapa com uma camada de tile e um círculo representando o perímetro */}
            <MapContainer center={[10, 10]} zoom={13} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {circleCenter && <Circle center={circleCenter} radius={circleRadius} />}
                <MapClickHandler />
            </MapContainer>
        </div>
    );
}

export default HeaderPerimeters;
