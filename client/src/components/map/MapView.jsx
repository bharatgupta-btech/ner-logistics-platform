import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { NER_CENTER, NER_BOUNDS } from '../../utils/constants';

// Placeholder components for map layers
const VehicleMarkers = () => null;
const DisruptionLayer = () => null;
const RouteLayer = () => null;
const HeatmapLayer = () => null;

const MapView = () => {
  return (
    <div className="h-full w-full relative flex">
      <div className="flex-1 h-full z-0">
        <MapContainer 
          center={NER_CENTER} 
          zoom={6} 
          className="h-full w-full"
          zoomControl={false}
          maxBounds={NER_BOUNDS}
          minZoom={5}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          <VehicleMarkers />
          <DisruptionLayer />
          <RouteLayer />
          <HeatmapLayer />
        </MapContainer>
      </div>
      
      {/* Map Sidebar */}
      <div className="w-80 bg-white border-l border-slate-200 p-4 shadow-lg z-10 overflow-y-auto">
        <h3 className="font-bold text-lg mb-4 text-slate-800">Map Controls</h3>
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h4 className="text-sm font-semibold mb-2">Layers</h4>
            <label className="flex items-center space-x-2 text-sm mb-1"><input type="checkbox" defaultChecked /> <span>Active Vehicles</span></label>
            <label className="flex items-center space-x-2 text-sm mb-1"><input type="checkbox" defaultChecked /> <span>Disruptions & Incidents</span></label>
            <label className="flex items-center space-x-2 text-sm mb-1"><input type="checkbox" defaultChecked /> <span>Route Network</span></label>
            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" /> <span>Weather Risk Heatmap</span></label>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <h4 className="text-sm font-semibold mb-2">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span><span>Trucks</span></div>
              <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500"></span><span>Critical Incident</span></div>
              <div className="flex items-center space-x-2"><div className="w-4 h-1 bg-green-500"></div><span>Clear Route</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
