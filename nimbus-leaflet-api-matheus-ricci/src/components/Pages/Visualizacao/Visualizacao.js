import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Rectangle, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import SideBar from '../../SideBar/SideBar';
import './Visualizacao.css';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Visualizacao = () => {
  // Configura os ícones padrão do Leaflet para marcadores
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
  });

  // Estados para armazenar dados dos pontos, áreas, perímetros e itens selecionados
  const [points, setPoints] = useState([]);
  const [areas, setAreas] = useState([]);
  const [perimeters, setPerimeters] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Estados para controlar a visibilidade dos pontos, áreas e perímetros
  const [showPoints, setShowPoints] = useState(false);
  const [showAreas, setShowAreas] = useState(false);
  const [showPerimeters, setShowPerimeters] = useState(false);

  // Carrega os dados da API quando o componente é montado
  useEffect(() => {
    fetch('http://localhost:3001/points')
      .then(response => response.json())
      .then(data => setPoints(data));

    fetch('http://localhost:3001/areas')
      .then(response => response.json())
      .then(data => setAreas(data));

    fetch('http://localhost:3001/perimeters')
      .then(response => response.json())
      .then(data => setPerimeters(data));
  }, []);

  // Funções para mostrar/esconder pontos, áreas e perímetros
  const toggleShowPoints = () => {
    setShowPoints(!showPoints);
    if (!showPoints) {
      setSelectedItems([...selectedItems, ...points.map(point => ({ type: 'point', id: point.id }))]);
    } else {
      setSelectedItems(selectedItems.filter(item => item.type !== 'point'));
    }
  };

  const toggleShowAreas = () => {
    setShowAreas(!showAreas);
    if (!showAreas) {
      setSelectedItems([...selectedItems, ...areas.map(area => ({ type: 'area', id: area.id }))]);
    } else {
      setSelectedItems(selectedItems.filter(item => item.type !== 'area'));
    }
  };

  const toggleShowPerimeters = () => {
    setShowPerimeters(!showPerimeters);
    if (!showPerimeters) {
      setSelectedItems([...selectedItems, ...perimeters.map(perimeter => ({ type: 'perimeter', id: perimeter.id }))]);
    } else {
      setSelectedItems(selectedItems.filter(item => item.type !== 'perimeter'));
    }
  };

  // Função para mostrar/esconder todos os itens
  const toggleShowAll = (show) => {
    setShowPoints(show);
    setShowAreas(show);
    setShowPerimeters(show);

    if (show) {
      setSelectedItems([
        ...points.map(point => ({ type: 'point', id: point.id })),
        ...areas.map(area => ({ type: 'area', id: area.id })),
        ...perimeters.map(perimeter => ({ type: 'perimeter', id: perimeter.id }))
      ]);
    } else {
      setSelectedItems([]);
    }
  };

  // Alterna a seleção de um item (ponto, área ou perímetro)
  const toggleSelectedItem = (type, id) => {
    const index = selectedItems.findIndex(item => item.type === type && item.id === id);
    if (index > -1) {
      setSelectedItems(selectedItems.filter(item => item.type !== type || item.id !== id));
    } else {
      setSelectedItems([...selectedItems, { type, id }]);
    }
  };

  // Renderiza as listas de pontos, áreas e perímetros na barra lateral
  const renderList = (items, type) => (
    <ul id='render-list'>
      {items.map((item) => {
        const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id && selectedItem.type === type);
        return (
          <li
            key={item.id}
            style={{ backgroundColor: isSelected ? '#d18720' : '#d6d8db' }}
            onClick={() => toggleSelectedItem(type, item.id)}
          >
            <div id='list-item-div'>
              {item.description}
              {isSelected ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          </li>
        );
      })}
    </ul>
  );

  // Componente para botões do cabeçalho na barra lateral
  const HeaderButton = ({ label }) => (
    <div className='interest-point'>
      <span className='interest-point-span'>{label}</span>
    </div>
  );

  // Renderiza marcadores no mapa para pontos selecionados
  const renderMarkers = () => {
    return points
      .filter(point => showPoints || selectedItems.some(selectedItem => selectedItem.type === 'point' && selectedItem.id === point.id))
      .map(point => (
        <Marker key={point.id} position={[point.lat, point.lng]}>
          <Popup>{point.description}</Popup>
        </Marker>
      ));
  };

  // Renderiza retângulos no mapa para áreas selecionadas
  const renderAreas = () => {
    return areas
      .filter(area => showAreas || selectedItems.some(selectedItem => selectedItem.type === 'area' && selectedItem.id === area.id))
      .map(area => (
        <Rectangle key={area.id} bounds={[[area.north, area.west], [area.south, area.east]]}>
          <Popup>{area.description}</Popup>
        </Rectangle>
      ));
  };

  // Renderiza círculos no mapa para perímetros selecionados
  const renderPerimeters = () => {
    return perimeters
      .filter(perimeter => showPerimeters || selectedItems.some(selectedItem => selectedItem.type === 'perimeter' && selectedItem.id === perimeter.id))
      .map(perimeter => (
        <Circle key={perimeter.id} center={[perimeter.centerLat, perimeter.centerLng]} radius={perimeter.radius}>
          <Popup>{perimeter.description}</Popup>
        </Circle>
      ));
  };

  // Renderização do componente com barra lateral e mapa
  return (
    <div className='box'>
      <SideBar>
        <HeaderButton label="Pontos" />
        <input type="checkbox" checked={showPoints} onChange={toggleShowPoints} /> Mostrar/Esconder Pontos
        {renderList(points, "point")}

        <HeaderButton label="Áreas" />
        <input type="checkbox" checked={showAreas} onChange={toggleShowAreas} /> Mostrar/Esconder Áreas
        {renderList(areas, "area")}

        <HeaderButton label="Perímetros" />
        <input type="checkbox" checked={showPerimeters} onChange={toggleShowPerimeters} /> Mostrar/Esconder Perímetros
        {renderList(perimeters, "perimeter")}

        <div>
          <button id='btn-hide' onClick={() => toggleShowAll(true)}>Mostrar Todos</button>
          <button id='btn-hide' onClick={() => toggleShowAll(false)}>Esconder Todos</button>
        </div>
      </SideBar>

      <MapContainer center={[-22.9069557612611, -43.23988648507283]} zoom={11} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {renderMarkers()}
        {renderAreas()}
        {renderPerimeters()}
      </MapContainer>
    </div>
  );
}

export default Visualizacao;
