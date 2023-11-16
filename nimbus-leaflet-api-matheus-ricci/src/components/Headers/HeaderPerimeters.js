import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HeaderPerimeters = ({ mode, id, description, centerLat, centerLng, radius }) => {
    const [desc, setDesc] = useState(description || '');
    const [circleCenter, setCircleCenter] = useState(
        centerLat && centerLng ? L.latLng(centerLat, centerLng) : null
    );
    const [circleRadius, setCircleRadius] = useState(radius || 200);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        setDesc(description || '');
        if (centerLat && centerLng) {
            setCircleCenter(L.latLng(centerLat, centerLng));
        }
        if (radius) {
            setCircleRadius(radius);
        }
    }, [description, centerLat, centerLng, radius]);

    const savePerimeter = async () => {
        if (!circleCenter) return;

        const perimeterData = {
            description: desc,
            centerLat: circleCenter.lat,
            centerLng: circleCenter.lng,
            radius: circleRadius
        };

        try {
            let response;
            if (mode === "Editar") {
                response = await fetch(`http://localhost:3001/perimeters/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(perimeterData),
                });
            } else {
                response = await fetch('http://localhost:3001/perimeters', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(perimeterData),
                });
            }

            if (response.ok) {
                toast.success(`${mode === "Editar" ? 'Perímetro Atualizado' : 'Perímetro Salvo'} com Sucesso!`, {
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
            toast.error(`Erro ao ${mode === "Editar" ? 'Atualizar' : 'Salvar'} o Perímetro!`, {
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

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                if (!isDrawing) {
                    setCircleCenter(e.latlng);
                    setCircleRadius(200);
                    setIsDrawing(true);
                } else {
                    setIsDrawing(false);
                }
            },
            mousemove(e) {
                if (isDrawing && circleCenter) {
                    const newRadius = circleCenter.distanceTo(e.latlng);
                    setCircleRadius(newRadius);
                }
            }
        });
        return null;
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
                <h1>{mode} Perímetro</h1>
                <label>Descrição</label>
                <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} />
                <label>Latitude</label>
                <input type="number" value={circleCenter ? circleCenter.lat : ''} onChange={handleLatChange} />
                <label>Longitude</label>
                <input type="number" value={circleCenter ? circleCenter.lng : ''} onChange={handleLngChange} />
                <label>Raio (metros)</label>
                <input type="number" value={circleRadius} onChange={handleRadiusChange} />
                <button onClick={() => {
                    savePerimeter()
                    setTimeout(() => {
                        window.location.reload()
                    }, 3500);
                }}>
                    Salvar
                </button>
            </div>
            <MapContainer center={[-22.9069557612611, -43.23988648507283]} zoom={11} scrollWheelZoom={true}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {circleCenter && <Circle center={circleCenter} radius={circleRadius} />}
                <MapClickHandler />
            </MapContainer>
        </div>
    );
}

export default HeaderPerimeters;
