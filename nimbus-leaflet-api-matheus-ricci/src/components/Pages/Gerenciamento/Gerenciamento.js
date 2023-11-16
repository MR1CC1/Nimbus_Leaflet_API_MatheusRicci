// Importando os módulos necessários para o componente.
import React, { useState, useEffect } from "react";
import L from "leaflet"; // Leaflet para mapas interativos
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa"; // Ícones do FontAwesome
import SideBar from '../../SideBar/SideBar'; // Componente da barra lateral
import HeaderInicialMap from '../../Headers/HeaderInicialMap';
import HeaderPoint from "../../Headers/HeaderPoint";
import HeaderAreas from "../../Headers/HeaderAreas";
import HeaderPerimeters from "../../Headers/HeaderPerimeters";
import { Marker, Rectangle, Circle, Popup } from 'react-leaflet'; // Componentes do Leaflet para o mapa
import './Gerenciamento.css'; // Estilos CSS específicos
import axios from "axios"; // Axios para requisições HTTP
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Definindo o componente funcional 'Gerenciamento'.
const Gerenciamento = () => {
    // Estados para gerenciar as informações da página e os itens do mapa
    const [headerPage, setHeaderPage] = useState('default'); // Estado para controlar o cabeçalho exibido
    const [points, setPoints] = useState([]); // Estado para armazenar os pontos
    const [areas, setAreas] = useState([]); // Estado para armazenar as áreas
    const [perimeters, setPerimeters] = useState([]); // Estado para armazenar os perímetros
    const [selectedItems, setSelectedItems] = useState([]); // Estado para gerenciar itens selecionados
    const [currentItem, setCurrentItem] = useState(null);

    // Configuração inicial dos ícones do Leaflet
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });

    const renderHeader = () => {
        switch (headerPage) {
            case 'points':
                return <HeaderPoint mode={"Novo"} />;
            case 'editpoints':
                return <HeaderPoint
                    mode="Editar"
                    id={currentItem?.id}
                    description={currentItem?.description}
                    latitude={currentItem?.lat}
                    longitude={currentItem?.lng} />;
            case 'areas':
                return <HeaderAreas mode={"Nova"} />;
            case 'editareas':
                return <HeaderAreas
                    mode="Editar"
                    id={currentItem?.id}
                    description={currentItem?.description}
                    north={currentItem?.north}
                    south={currentItem?.south}
                    west={currentItem?.west}
                    east={currentItem?.east} />;
            case 'perimeters':
                return <HeaderPerimeters mode={"Novo"} />;
            case 'editperimeters':
                return <HeaderPerimeters
                    mode="Editar"
                    id={currentItem?.id}
                    description={currentItem?.description}
                    centerLat={currentItem?.centerLat}
                    centerLng={currentItem?.centerLng}
                    radius={currentItem?.radius} />;
            default:
                return <HeaderInicialMap />;
        }
    };

    const EditHeaderButton = ({ page, item }) => (
        <div className='interest-point'>
            <FaEdit className='icons-fa' onClick={() => {
                setHeaderPage(page);
                setCurrentItem(item); // Atualiza o item atual
            }} />
        </div>
    );

    // Carrega os dados da API na montagem do componente
    useEffect(() => {
        axios.get('http://localhost:3001/points').then(response => setPoints(response.data));
        axios.get('http://localhost:3001/areas').then(response => setAreas(response.data));
        axios.get('http://localhost:3001/perimeters').then(response => setPerimeters(response.data));
    }, []);

    // Função para excluir um item
    const deleteItem = (type, id) => {
        axios.delete(`http://localhost:3001/${type}s/${id}`)
            .then(() => {
                // Atualiza os estados após a exclusão
                if (type === 'point') {
                    setPoints(points.filter(item => item.id !== id));
                } else if (type === 'area') {
                    setAreas(areas.filter(item => item.id !== id));
                } else if (type === 'perimeter') {
                    setPerimeters(perimeters.filter(item => item.id !== id));
                }
                setSelectedItems(selectedItems.filter(item => item.id !== id));
                toast.success('Item Excluido com Sucesso!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })
            .catch(error => console.error('Erro ao excluir o item:', error));
    };

    // Renderiza as listas na barra lateral
    const renderList = (items, type) => (
        <ul id='render-list'>
            {items.map((item) => (
                <li
                    key={item.id}
                // Removido o controle de cor ao clicar no item
                >
                    <div id="list-markers">
                        {item.description}
                        <div>
                            {type === 'point' ? <EditHeaderButton page="editpoints" item={item} /> :
                                type === 'area' ? <EditHeaderButton page="editareas" item={item} />
                                    : <EditHeaderButton page="editperimeters" item={item} />}
                            &nbsp;
                            <FaTrashAlt id="icon-trash" onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(type, item.id);
                            }} />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    // Renderiza os marcadores no mapa
    const renderMarkers = () => {
        return points
            .filter(point => selectedItems.some(selectedItem => selectedItem.type === 'point' && selectedItem.id === point.id))
            .map(point => (
                <Marker key={point.id} position={[point.lat, point.lng]}>
                    <Popup>{point.description}</Popup>
                </Marker>
            ));
    };

    // Renderiza as áreas no mapa
    const renderAreas = () => {
        return areas
            .filter(area => selectedItems.some(selectedItem => selectedItem.type === 'area' && selectedItem.id === area.id))
            .map(area => (
                <Rectangle key={area.id} bounds={[[area.north, area.west], [area.south, area.east]]}>
                    <Popup>{area.description}</Popup>
                </Rectangle>
            ));
    };

    // Renderiza os perímetros no mapa
    const renderPerimeters = () => {
        return perimeters
            .filter(perimeter => selectedItems.some(selectedItem => selectedItem.type === 'perimeter' && selectedItem.id === perimeter.id))
            .map(perimeter => (
                <Circle key={perimeter.id} center={[perimeter.centerLat, perimeter.centerLng]} radius={perimeter.radius}>
                    <Popup>{perimeter.description}</Popup>
                </Circle>
            ));
    };

    // Componente para os botões do cabeçalho
    const HeaderButton = ({ label, page }) => (
        <div className='interest-point'>
            <span className='interest-point-span'>{label}&nbsp;<FaPlus className='icons-fa' onClick={() => setHeaderPage(page)} /></span>
        </div>
    );

    // Renderização do componente
    return (
        <div className='box'>
            <SideBar>
                <HeaderButton label="Pontos" page="points" />
                {renderList(points, "point")}
                <HeaderButton label="Áreas" page="areas" />
                {renderList(areas, "area")}
                <HeaderButton label="Perímetros" page="perimeters" />
                {renderList(perimeters, "perimeter")}
            </SideBar>
            <div>
                {renderHeader()}
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
                {renderMarkers()}
                {renderAreas()}
                {renderPerimeters()}
            </div>
        </div>
    );
};

export default Gerenciamento; // Exportando o componente
