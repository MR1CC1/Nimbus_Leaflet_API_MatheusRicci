import './App.css';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from "leaflet";

function App() {

  const position = [-22.914538, -43.094126]

  const markerIcon = new L.Icon({
    iconUrl: require("./components/img/marker.png"),
    iconSize: [40, 40],
    iconAnchor: [17, 46], //[left/right, top/bottom]
    popupAnchor: [0, -46], //[left/right, top/bottom]
  });
  
  return (
    <div>
    <MapContainer center={position} zoom={11} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={markerIcon}>
          <Popup>
            Ricci Home
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;



