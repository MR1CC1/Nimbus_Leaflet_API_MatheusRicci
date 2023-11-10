// Importações dos módulos necessários.
import React, { useState } from "react";
import L from "leaflet";
import { FaPlus } from "react-icons/fa";
import SideBar from '../../SideBar/SideBar';
import HeaderInicialMap from '../../Headers/HeaderInicialMap';
import HeaderPoint from "../../Headers/HeaderPoint";
import HeaderAreas from "../../Headers/HeaderAreas";
import HeaderPerimeters from "../../Headers/HeaderPerimeters";

// Definindo o componente funcional 'Gerenciamento'.
const Gerenciamento = () => {
    const [headerPage, setHeaderPage] = useState('default'); // Inicializando o estado 'headerPage' com 'default'.

    // Configurando os ícones globais do Leaflet.
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });

    // Mapeamento de 'headerPage' para componentes correspondentes.
    const headers = {
        'points': HeaderPoint,
        'areas': HeaderAreas,
        'perimeters': HeaderPerimeters,
        'default': HeaderInicialMap
    };

    // Determinando qual componente de cabeçalho renderizar com base no estado atual.
    const HeaderComponent = headers[headerPage];

    // Definindo um componente para os botões do cabeçalho.
    const HeaderButton = ({ label, page }) => (
        <div className='interest-point'>
            <span className='interest-point-span'>{label} <FaPlus className='icons-fa' onClick={() => setHeaderPage(page)} /></span>
        </div>
    );

    // Renderizando o componente.
    return (
        <div className='box'>
            <SideBar>
                <HeaderButton label="Pontos" page="points" />
                <HeaderButton label="Áreas" page="areas" />
                <HeaderButton label="Perímetros" page="perimeters" />
            </SideBar>
            <HeaderComponent />
        </div>
    );
};

export default Gerenciamento;
