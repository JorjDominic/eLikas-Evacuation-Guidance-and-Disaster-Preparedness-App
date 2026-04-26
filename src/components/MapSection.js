import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix Leaflet's default marker icon paths broken by webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

// Bulacan, Philippines center coordinates
const BULACAN_CENTER = [14.7942, 120.8793];
const DEFAULT_ZOOM = 11;

// ─── Draw Control ────────────────────────────────────────────────────────────
function DrawControl({ onShapeCreated, onShapeDeleted }) {
  const map = useMap();
  const drawnItems = useRef(null);

  useEffect(() => {
    drawnItems.current = new L.FeatureGroup();
    map.addLayer(drawnItems.current);

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      edit: {
        featureGroup: drawnItems.current,
        remove: true,
      },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: { color: '#1a3a5f', fillOpacity: 0.22 },
        },
        rectangle: {
          shapeOptions: { color: '#b22b0f', fillOpacity: 0.18 },
        },
        circle: {
          shapeOptions: { color: '#059669', fillOpacity: 0.18 },
        },
        marker: true,
        polyline: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    const handleCreated = (e) => {
      const { layer, layerType } = e;
      drawnItems.current.addLayer(layer);
      const id = L.stamp(layer);

      let description = '';
      if (layerType === 'polygon') description = 'Polygon area marked';
      else if (layerType === 'rectangle') description = 'Rectangle zone marked';
      else if (layerType === 'circle') {
        const r = Math.round(layer.getRadius());
        description = `Circle zone, radius ${r.toLocaleString()} m`;
      } else if (layerType === 'marker') {
        const { lat, lng } = layer.getLatLng();
        description = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }

      onShapeCreated({ id, layerType, description });
    };

    const handleDeleted = (e) => {
      e.layers.eachLayer((layer) => onShapeDeleted(L.stamp(layer)));
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.DELETED, handleDeleted);

    return () => {
      map.removeControl(drawControl);
      if (drawnItems.current) map.removeLayer(drawnItems.current);
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.DELETED, handleDeleted);
    };
  }, [map, onShapeCreated, onShapeDeleted]);

  return null;
}

// ─── GPS Locate Button ────────────────────────────────────────────────────────
function LocateControl() {
  const map = useMap();
  const [status, setStatus] = useState('idle'); // idle | locating | found | error
  const markerRef = useRef(null);

  const handleLocate = () => {
    if (status === 'locating') return;
    setStatus('locating');

    map.locate({ setView: true, maxZoom: 16 });

    map.once('locationfound', (e) => {
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = L.marker(e.latlng)
        .addTo(map)
        .bindPopup(
          `<strong>You are here</strong><br/>Accuracy: ±${Math.round(e.accuracy)} m`
        )
        .openPopup();
      setStatus('found');
    });

    map.once('locationerror', () => {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    });
  };

  const label = { idle: 'My Location', locating: 'Locating…', found: 'Located', error: 'No Access' }[status];
  const icon = { idle: 'my_location', locating: 'location_searching', found: 'location_on', error: 'location_off' }[status];

  return (
    <div className="map-locate-wrapper leaflet-top leaflet-right" style={{ pointerEvents: 'none' }}>
      <div className="leaflet-control" style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          className={`map-locate-btn map-locate-${status}`}
          onClick={handleLocate}
          aria-label="Find my GPS location"
        >
          <span className="material-symbols-outlined">{icon}</span>
          <span>{label}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Shape type icons ─────────────────────────────────────────────────────────
const SHAPE_ICONS = {
  polygon: 'pentagon',
  rectangle: 'crop_square',
  circle: 'radio_button_unchecked',
  marker: 'location_on',
};

const SHAPE_COLORS = {
  polygon: '#1a3a5f',
  rectangle: '#b22b0f',
  circle: '#059669',
  marker: '#7c3aed',
};

// ─── Main MapSection ──────────────────────────────────────────────────────────
function MapSection() {
  const [savedShapes, setSavedShapes] = useState([]);

  const handleShapeCreated = useCallback((shape) => {
    setSavedShapes((prev) => [
      ...prev,
      { ...shape, name: `Zone ${prev.length + 1}`, savedAt: new Date().toLocaleTimeString() },
    ]);
  }, []);

  const handleShapeDeleted = useCallback((id) => {
    setSavedShapes((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <section id="map" className="map-section">
      <div className="layout">
        <span className="section-num">03</span>
        <div className="section-heading">
          <div className="section-eyebrow">Interactive Map</div>
          <h2>Explore &amp; Map Your Area</h2>
          <p>
            View Bulacan in real time. Use the draw tools to mark evacuation zones, hazard
            areas, or safe routes — then save them for reference.
          </p>
        </div>

        <div className="map-outer">
          <MapContainer
            center={BULACAN_CENTER}
            zoom={DEFAULT_ZOOM}
            className="landing-leaflet-map"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocateControl />
            <DrawControl
              onShapeCreated={handleShapeCreated}
              onShapeDeleted={handleShapeDeleted}
            />
          </MapContainer>

          <div className="map-draw-hint">
            <span className="material-symbols-outlined">edit_note</span>
            <span>
              Use the <strong>toolbar (top-left)</strong> to draw polygons, rectangles, or circles.
              Hit the <strong>pencil icon</strong> to edit or <strong>trash</strong> to delete saved shapes.
            </span>
          </div>
        </div>

        {savedShapes.length > 0 && (
          <div className="saved-zones">
            <div className="saved-zones-header">
              <span className="material-symbols-outlined">layers</span>
              <h3>Saved Zones &amp; Markers ({savedShapes.length})</h3>
            </div>
            <div className="saved-zones-grid">
              {savedShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="saved-zone-card"
                  style={{ '--zone-color': SHAPE_COLORS[shape.layerType] || '#1a3a5f' }}
                >
                  <span
                    className="material-symbols-outlined saved-zone-icon"
                  >
                    {SHAPE_ICONS[shape.layerType] || 'pentagon'}
                  </span>
                  <div className="saved-zone-info">
                    <strong>{shape.name}</strong>
                    <p>{shape.description}</p>
                    <small>Saved at {shape.savedAt}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default MapSection;
