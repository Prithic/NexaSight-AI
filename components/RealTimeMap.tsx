"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Info, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import L from "leaflet";
import { useEffect } from "react";

// Custom Marker Creator
const createCustomIcon = (severity: string) => {
  const color = severity === 'Critical' ? '#f43f5e' : severity === 'High' ? '#38bdf8' : '#10b981';
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-8 h-8 bg-[${color}] opacity-20 rounded-full animate-ping"></div>
      <div class="relative w-4 h-4 bg-[${color}] border-2 border-white rounded-full shadow-[0_0_10px_${color}]"></div>
    </div>
  `;
  
  return L.divIcon({
    html,
    className: 'custom-map-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function MapResizer({ reports }: { reports: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (reports.length > 0) {
      const bounds = L.latLngBounds(reports.map(r => [r.lat, r.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [reports, map]);

  return null;
}

interface MapReport {
  id: string | number;
  type: string;
  severity: string;
  lat: number;
  lng: number;
  description: string;
}

interface RealTimeMapProps {
  reports: MapReport[];
}

export default function RealTimeMap({ reports }: RealTimeMapProps) {
  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={[12.9716, 77.5946]} // Default to a city or empty
        zoom={12} 
        style={{ height: "100%", width: "100%", background: "#09090b" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapResizer reports={reports} />

        {reports.map((report) => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]}
            icon={createCustomIcon(report.severity)}
          >
            <Popup className="premium-popup">
              <div className="p-4 bg-zinc-950/90 border border-white/10 rounded-[1.5rem] backdrop-blur-xl w-64 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {report.severity === 'Critical' ? (
                      <AlertCircle size={14} className="text-rose-500" />
                    ) : (
                      <CheckCircle2 size={14} className="text-brand" />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{report.type}</span>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded border font-black uppercase tracking-tighter ${
                    report.severity === 'Critical' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                      : 'bg-brand/10 border-brand/20 text-brand'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                
                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-4 line-clamp-3">
                  {report.description}
                </p>

                <div className="flex items-center space-x-2">
                  <button className="flex-1 bg-white text-black text-[9px] font-black uppercase tracking-widest h-8 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Details
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                    <MapPin size={12} />
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Control Stub */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
         <button className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/5 transition-colors">
           <Info size={18} />
         </button>
      </div>

      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          background: #09090b !important;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .custom-map-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
