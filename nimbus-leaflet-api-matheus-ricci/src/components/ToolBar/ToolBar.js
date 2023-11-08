import React from 'react'
import "leaflet/dist/leaflet.css";
import { FeatureGroup } from 'react-leaflet';
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import './ToolBar.css'

const ToolBar = () => {

    const _created = (e) => console.log(e);

    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
    });

    return (
        <FeatureGroup>
            <EditControl
                position="topright"
                onCreated={_created}
                draw={
                    {
                      rectangle: false,
                      circle: false,
                      circlemarker: false,
                      marker: true,
                      polyline: false,
                      polygon: false,
                      
                    }
                }
            />
        </FeatureGroup>
    )
}

export default ToolBar