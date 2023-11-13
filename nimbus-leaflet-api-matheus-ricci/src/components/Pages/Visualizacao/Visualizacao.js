import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Rectangle, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import SideBar from '../../SideBar/SideBar';
import './Visualizacao.css'

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
      {items.map((item) => (
        <li
          key={item.id}
          style={{ backgroundColor: selectedItems.some(selectedItem => selectedItem.id === item.id && selectedItem.type === type) ? '#d18720' : '#d6d8db' }}
          onClick={() => toggleSelectedItem(type, item.id)}
        >
          <div>{item.description}</div>
        </li>
      ))}
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
      .filter(point => selectedItems.some(selectedItem => selectedItem.type === 'point' && selectedItem.id === point.id))
      .map(point => (
        <Marker key={point.id} position={[point.lat, point.lng]}>
          <Popup>{point.description}</Popup>
        </Marker>
      ));
  };

  // Renderiza retângulos no mapa para áreas selecionadas
  const renderAreas = () => {
    return areas
      .filter(area => selectedItems.some(selectedItem => selectedItem.type === 'area' && selectedItem.id === area.id))
      .map(area => (
        <Rectangle key={area.id} bounds={[[area.north, area.west], [area.south, area.east]]}>
          <Popup>{area.description}</Popup>
        </Rectangle>
      ));
  };

  // Renderiza círculos no mapa para perímetros selecionados
  const renderPerimeters = () => {
    return perimeters
      .filter(perimeter => selectedItems.some(selectedItem => selectedItem.type === 'perimeter' && selectedItem.id === perimeter.id))
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
        {renderList(points, "point")}
        <HeaderButton label="Áreas" />
        {renderList(areas, "area")}
        <HeaderButton label="Perímetros" />
        {renderList(perimeters, "perimeter")}
      </SideBar>
      <MapContainer center={[10, 10]} zoom={13} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {renderMarkers()}
        {renderAreas()}
        {renderPerimeters()}
      </MapContainer>
    </div>
  );
}

export default Visualizacao;
