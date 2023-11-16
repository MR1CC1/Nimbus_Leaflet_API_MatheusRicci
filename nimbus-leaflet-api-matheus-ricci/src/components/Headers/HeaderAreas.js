import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MapEventHandler = ({ onMapClick, onMapMouseMove, drawing }) => {
    useMapEvents({
        click: onMapClick,
        mousemove: drawing ? onMapMouseMove : undefined,
    });
    return null;
};

const HeaderAreas = ({ mode, id, description, north, south, west, east }) => {
    const [desc, setDesc] = useState(description || '');
    const [bounds, setBounds] = useState(
        north && south && west && east ? L.latLngBounds([[north, west], [south, east]]) : null
    );
    const [drawing, setDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState(null);

    useEffect(() => {
        setDesc(description || '');
        if (north && south && west && east) {
            setBounds(L.latLngBounds([[north, west], [south, east]]));
        }
    }, [description, north, south, west, east]);

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

    const saveArea = async () => {
        if (!bounds) return;

        const areaData = {
            description: desc,
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            west: bounds.getWest(),
            east: bounds.getEast()
        };

        try {
            let response;
            if (mode === "Editar") {
                response = await fetch(`http://localhost:3001/areas/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(areaData),
                });
            } else {
                response = await fetch('http://localhost:3001/areas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(areaData),
                });
            }

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

export default HeaderAreas;
