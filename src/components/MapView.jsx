import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'

// Eigen pin via divIcon, zodat we niet afhankelijk zijn van Leaflet's
// standaard-marker-afbeeldingen (die breken vaak met een bundler).
// In de druppel zit een wit cirkeltje met het echte winkellogo; als dat
// niet laadt, valt het terug op de emoji.
function pin(store) {
  const inner = store.logoDomain
    ? `<img src="https://www.google.com/s2/favicons?sz=64&domain=${store.logoDomain}"
         onerror="this.outerHTML='<span style=&quot;font-size:14px&quot;>${store.emoji}</span>'"
         style="width:16px;height:16px;object-fit:contain;" />`
    : `<span style="font-size:14px;">${store.emoji}</span>`

  return L.divIcon({
    className: '',
    html: `<div style="
      width:34px;height:34px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${store.kleur};box-shadow:0 2px 6px rgba(0,0,0,.3);
      display:flex;align-items:center;justify-content:center;">
        <span style="transform:rotate(45deg);display:flex;width:22px;height:22px;border-radius:50%;background:#fff;align-items:center;justify-content:center;">${inner}</span>
      </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  })
}

export default function MapView({ stores, userLocation, onSelectStore, height = 220 }) {
  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height, width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Gesimuleerde gebruikerslocatie */}
      <CircleMarker
        center={[userLocation.lat, userLocation.lng]}
        radius={8}
        pathOptions={{ color: '#7c3aed', fillColor: '#7c3aed', fillOpacity: 0.9 }}
      >
        <Popup>Jij bent hier · {userLocation.label}</Popup>
      </CircleMarker>

      {stores.map((s) => (
        <Marker
          key={s.id}
          position={[s.lat, s.lng]}
          icon={pin(s)}
          eventHandlers={{ click: () => onSelectStore?.(s.id) }}
        >
          <Popup>
            <strong>{s.naam}</strong>
            <br />
            {s.type} · {s.cashback}% cashback
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
