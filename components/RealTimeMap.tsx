"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Info } from "lucide-react";
import L from "leaflet";
import { useEffect } from "react";

// Fix default marker icon issue in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapReport {
  id: number;
  type: string;
  severity: string;
  lat: number;
  lng: number;
  desc: string;
}

interface RealTimeMapProps {
  reports: MapReport[];
}

export default function RealTimeMap({ reports }: RealTimeMapProps) {
  return (
    <MapContainer 
      center={[51.505, -0.09]} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((report) => (
        <Marker key={report.id} position={[report.lat, report.lng]}>
          <Popup>
            <div className="p-2 space-y-2 max-w-[200px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{report.type}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  report.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {report.severity}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-tight">{report.desc}</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1">
                <Info size={10} />
                <span>View Full Report</span>
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
