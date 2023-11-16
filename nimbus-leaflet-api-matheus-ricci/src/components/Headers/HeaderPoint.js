import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import '../SideBar/SideBar.css';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const HeaderPoint = ({ mode, id,  description, latitude, longitude }) => {
    // Usar os valores das props para inicializar os estados
    const [descPoint, SetDescPoint] = useState('');
    const [latPoint, SetLatPoint] = useState(0);
    const [lngPoint, SetLngPoint] = useState(0);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        SetDescPoint(description || '');
        SetLatPoint(latitude || 0);
        SetLngPoint(longitude || 0);
    }, [description, latitude, longitude]);

    const savePoint = async () => {
        const pointData = {
            description: descPoint,
            lat: latPoint,
            lng: lngPoint
        };
    
        let response;
        try {
            if (mode === "Editar") {
                // Requisição PUT para atualizar o ponto
                response = await fetch(`http://localhost:3001/points/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pointData),
                });
            } else {
                // Requisição POST para criar um novo ponto
                response = await fetch('http://localhost:3001/points', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pointData),
                });
            }
    
            if (response.ok) {
                toast.success('Ponto Salvo com Sucesso!', {
                    // Configurações do toast
                });
            }
        } catch (error) {
            toast.error('Erro ao Salvar o Ponto!', {
                // Configurações do toast
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
                <h1>{mode} Ponto</h1>
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
                <button onClick={() => {
                    savePoint()
                    setTimeout(() => {
                        window.location.reload()
                        }, 3500);
                }}>
                    Salvar
                </button>
            </div>
            {/* Container do mapa com uma camada de tile e um marcador representando o ponto */}
            <MapContainer
                center={[-22.9069557612611, -43.23988648507283]}
                zoom={11}
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
