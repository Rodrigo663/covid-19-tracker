import React from 'react';
import './Map.css';
import { showDataMap } from "./util.js";

import { Map as LeafMap,TileLayer} from "react-leaflet";
function Map(
    {center, zoom, casesType, countries}) {

    return (
        <div className='map'>
            <LeafMap center={center} zoom={zoom}>
                <TileLayer
                   attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"> 

                </TileLayer>

                {/* Loop through and draw circles on the screen */}
                { showDataMap(countries, casesType) }
            </LeafMap>
        </div>
    )
}

export default Map
