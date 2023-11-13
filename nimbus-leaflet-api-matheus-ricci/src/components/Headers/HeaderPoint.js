import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import '../SideBar/SideBar.css';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const HeaderPoint = () => {
    // Estados para gerenciar descrição, latitude, longitude e o marcador no mapa
    const [descPoint, SetDescPoint] = useState('');
    const [latPoint, SetLatPoint] = useState(0);
    const [lngPoint, SetLngPoint] = useState(0);
    const [marker, setMarker] = useState(null);

    // Função para salvar o ponto no servidor
    const savePoint = async () => {
        // Prepara os dados do ponto para envio
        const pointData = {
            description: descPoint,
            lat: latPoint,
            lng: lngPoint
        };

        // Faz a requisição POST para salvar os dados
        try {
            const response = await fetch('http://localhost:3001/points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pointData),
            });

            if (response.ok) {
                toast.success('Ponto Salvo com Sucesso!', {
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
            toast.error('Erro ao Salvar o Ponto!', {
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

    // Funções para manipular mudanças nos inputs de descrição, latitude e longitude
    const handleInputDesc = (e) => {
        SetDescPoint(e.target.value);
    };

    const handleInputLat = (e) => {
        const newLat = parseFloat(e.target.value);
        SetLatPoint(newLat);
        // Atualiza o marcador no mapa se as coordenadas são válidas
        if (!isNaN(newLat) && !isNaN(lngPoint)) {
            setMarker({ lat: newLat, lng: lngPoint });
        }
    };

    const handleInputLng = (e) => {
        const newLng = parseFloat(e.target.value);
        SetLngPoint(newLng);
        if (!isNaN(latPoint) && !isNaN(newLng)) {
            setMarker({ lat: latPoint, lng: newLng });
        }
    };

    // Efeito para atualizar o marcador no mapa quando as coordenadas mudam
    useEffect(() => {
        if (latPoint && lngPoint) {
            setMarker({ lat: latPoint, lng: lngPoint });
        }
    }, [latPoint, lngPoint]);

    // Componente para lidar com eventos do mapa
    function MapClickHandler() {
        useMapEvents({
            click(e) {
                // Define um novo marcador no local onde o mapa foi clicado
                const newMarker = e.latlng;
                setMarker(newMarker);
                SetLatPoint(newMarker.lat);
                SetLngPoint(newMarker.lng);
            },
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
                <h1>Novo Ponto</h1>
                {/* Campos de entrada para descrição, latitude e longitude */}
                <label>Descrição</label>
                <input
                    type="text"
                    value={descPoint}
                    onChange={handleInputDesc}
                />
                <label>Latitude</label>
                <input
                    type="number"
                    value={latPoint || ''}
                    onChange={handleInputLat}
                />
                <label>Longitude</label>
                <input
                    type="number"
                    value={lngPoint || ''}
                    onChange={handleInputLng}
                />
                <button onClick={savePoint}>
                    Salvar
                </button>
            </div>
            {/* Container do mapa com uma camada de tile e um marcador representando o ponto */}
            <MapContainer
                center={[10, 10]}
                zoom={13}
                scrollWheelZoom={true}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {marker && <Marker position={marker}></Marker>}
                <MapClickHandler />
            </MapContainer>
        </div>
    );
}

export default HeaderPoint;
