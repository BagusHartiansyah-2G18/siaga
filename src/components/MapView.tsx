'use client';

import { MapContainer, TileLayer, Marker, Popup,Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { __duser } from "@/lib/firebase";
import { Iaktivitas } from '@/types';

const customIcon = new L.Icon({
  iconUrl: '/Red.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const customIcon1 = new L.Icon({
  iconUrl: '/R.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
 
export default function MapViewInner({ defaultLocations }:{defaultLocations:Iaktivitas[]}) {
  const usr = __duser();
  return (
    <MapContainer
      center={[-8.6761029,116.8454573]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-96 w-full rounded-xl shadow-md"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {defaultLocations.map((r) => (
        <Marker
          key={String(r.key)}
          position={[Number(r.lat), Number(r.lng)]}
          icon={r.kategori === "laporan" ? customIcon1 : customIcon}
        >
          {Number(r.aktif) == 1 && (
            <Tooltip permanent direction="top">
              <span>Dalam Proses petugas {r.nmPetugas}</span>
            </Tooltip>
          )}
          <Popup>
            <a
              href={`${origin}/rute/${r.key}/${usr.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              <b>{r.nama}</b>
              <br />
              {r.kategori === "laporan" ? r.judul : r.kategori}
            </a>
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  );
}