import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';
import WeatherWidget from '../../components/WeatherWidget';

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const BULACAN_CENTER = [14.7942, 120.8793];

function FlyTo({ position }) {
	const map = useMap();
	useEffect(() => { if (position) map.flyTo(position, 14, { duration: 0.8 }); }, [position, map]);
	return null;
}

function AlertsPage() {
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [flyTo, setFlyTo] = useState(null);

	useEffect(() => {
		async function fetchAlerts() {
			const { data, error: err } = await supabase
				.from('alerts')
				.select('*')
				.order('created_at', { ascending: false });
			if (err) setError(err.message);
			else setAlerts(data || []);
			setLoading(false);
		}
		fetchAlerts();
	}, []);

	const mappable = alerts.filter((a) => a.latitude != null && a.longitude != null);

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Disaster Alerts</h1>
					<p>Official warnings and community-level advisories prioritized by urgency, exposure, and timing.</p>
					<div className="hero-meta">
						<span className="hero-pill">LGU + PAGASA Sources</span>
						<span className="hero-pill">Updated Every 5 Minutes</span>
					</div>
				</div>

				{/* Live Weather & Preparedness Risk */}
				<div className="panel-grid" style={{ marginBottom: '1.25rem' }}>
					<div style={{ gridColumn: 'span 12' }}>
						<WeatherWidget />
					</div>
				</div>

				{loading && <p>Loading alertsâ€¦</p>}
				{error && <p style={{ color: 'var(--color-danger, red)' }}>{error}</p>}
				{!loading && !error && alerts.length === 0 && (
					<p>No active alerts at this time.</p>
				)}

				{/* Overview map â€” only when at least one alert has coordinates */}
				{!loading && mappable.length > 0 && (
					<div className="card" style={{ marginBottom: '1.25rem', padding: '0' }}>
						<MapContainer
							center={BULACAN_CENTER}
							zoom={11}
							style={{ height: '300px', width: '100%', borderRadius: '0.75rem' }}
							scrollWheelZoom={false}
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<FlyTo position={flyTo} />
							{mappable.map((alert) => (
								<Marker key={alert.id} position={[alert.latitude, alert.longitude]}>
									<Popup>
										<strong>{alert.title}</strong><br />
										{alert.area}<br />
										<span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{alert.level} severity</span>
									</Popup>
								</Marker>
							))}
						</MapContainer>
					</div>
				)}

				<div className="alert-feed">
					{alerts.map((alert) => (
						<article key={alert.id} className={`alert-row ${alert.level}`}>
							<div style={{ flex: 1 }}>
								<h3>{alert.title}</h3>
								<p><strong>Affected Area:</strong> {alert.area}</p>
								{alert.description && <p style={{ marginTop: '0.25rem', color: 'var(--text-muted, #555)', fontSize: '0.9rem' }}>{alert.description}</p>}
								<small>{new Date(alert.created_at).toLocaleString()}</small>
								{alert.latitude != null && alert.longitude != null && (
									<div style={{ marginTop: '0.6rem', borderRadius: '0.5rem', overflow: 'hidden', height: '150px' }}>
										<MapContainer
											center={[alert.latitude, alert.longitude]}
											zoom={13}
											style={{ height: '100%', width: '100%' }}
											scrollWheelZoom={false}
											zoomControl={false}
											dragging={false}
											attributionControl={false}
										>
											<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
											<Marker position={[alert.latitude, alert.longitude]} />
										</MapContainer>
									</div>
								)}
							</div>
							<div className="action-row" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
								<span className={`status-pill ${alert.level}`}>{alert.level}</span>
								{alert.latitude != null && alert.longitude != null && (
									<button
										type="button"
										className="btn-inline"
										style={{ fontSize: '0.75rem' }}
										onClick={() => setFlyTo([alert.latitude, alert.longitude])}
									>
										Show on Map
									</button>
								)}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default AlertsPage;
