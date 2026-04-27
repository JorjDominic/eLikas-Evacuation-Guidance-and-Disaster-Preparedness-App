import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../config/supabase';
import { reverseGeocode } from '../../services/weatherService';
import '../../styles/shared/sentinel.css';
import '../../styles/user/HazardReportPage.css';

// Fix Leaflet default icon paths broken by webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

const BULACAN_CENTER = [14.7942, 120.8793];

// ── Click anywhere on the map to place a pin ─────────────────────
function ClickToPin({ onPin }) {
	useMapEvents({ click: (e) => onPin(e.latlng.lat, e.latlng.lng) });
	return null;
}

// ── GPS locate button rendered inside the map ────────────────────
function GpsLocator({ onPin }) {
	const map = useMap();
	const [status, setStatus] = useState('idle');

	const handleGps = () => {
		if (status === 'locating') return;
		setStatus('locating');
		map.locate({ setView: true, maxZoom: 16 });
		map.once('locationfound', (e) => {
			onPin(e.latlng.lat, e.latlng.lng);
			setStatus('found');
		});
		map.once('locationerror', () => {
			setStatus('error');
			setTimeout(() => setStatus('idle'), 3000);
		});
	};

	const labels = { idle: 'Use GPS', locating: 'Locating…', found: 'GPS Located', error: 'GPS Denied' };
	const icons  = { idle: 'my_location', locating: 'location_searching', found: 'location_on', error: 'location_off' };

	return (
		<div className="leaflet-top leaflet-right hr-gps-control" style={{ pointerEvents: 'none' }}>
			<div className="leaflet-control" style={{ pointerEvents: 'auto' }}>
				<button
					type="button"
					className={`hr-gps-btn hr-gps-${status}`}
					onClick={handleGps}
					aria-label="Use GPS to pin location"
				>
					<span className="material-symbols-outlined" aria-hidden="true">{icons[status]}</span>
					{labels[status]}
				</button>
			</div>
		</div>
	);
}

// ── Main page ────────────────────────────────────────────────────
function HazardReportPage({ currentUser }) {
	const [form, setForm] = useState({
		hazard_type: 'Flooding',
		location: '',
		description: ''
	});
	const [pin, setPin]           = useState(null); // { lat, lon }
	const [geocoding, setGeocoding] = useState(false);
	const [loading, setLoading]   = useState(false);
	const [error, setError]       = useState('');
	const [success, setSuccess]   = useState('');

	const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

	const handlePin = useCallback(async (lat, lon) => {
		setPin({ lat, lon });
		setGeocoding(true);
		const label = await reverseGeocode(lat, lon);
		setGeocoding(false);
		setForm((f) => ({
			...f,
			location: label || `${lat.toFixed(5)}°N, ${lon.toFixed(5)}°E`
		}));
	}, []);

	const clearPin = () => {
		setPin(null);
		setForm((f) => ({ ...f, location: '' }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!form.location.trim()) {
			setError('Please enter or pin a location.');
			return;
		}
		if (!form.description.trim()) {
			setError('Please describe the hazard.');
			return;
		}

		setLoading(true);
		const { data: { user } } = await supabase.auth.getUser();
		const { error: err } = await supabase.from('hazard_reports').insert([{
			hazard_type:   form.hazard_type,
			location:      form.location.trim(),
			latitude:      pin?.lat ?? null,
			longitude:     pin?.lon ?? null,
			description:   form.description.trim(),
			status:        'pending',
			reporter_id:   user?.id ?? null,
			reporter_name: currentUser?.name ?? user?.email ?? null
		}]);
		setLoading(false);

		if (err) { setError(err.message); return; }

		setSuccess('Report submitted. Our team will review it shortly.');
		setForm({ hazard_type: 'Flooding', location: '', description: '' });
		setPin(null);
	};

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Report Hazard</h1>
					<p>Submit verified road, flooding, and electrical incidents to support faster triage and route protection.</p>
					<div className="hero-meta">
						<span className="hero-pill">Community Incident Intake</span>
						<span className="hero-pill">Ops Desk Response Window: 5-10 min</span>
					</div>
				</div>

				<h2 className="section-title">Incident Submission</h2>
				<div className="panel-grid">
					<form className="card" style={{ gridColumn: 'span 7', display: 'grid', gap: '0.45rem' }} onSubmit={handleSubmit}>
						{error   && <div className="sb-auth-error">{error}</div>}
						{success && <div className="sb-auth-message">{success}</div>}

						<label>Hazard Type</label>
						<select value={form.hazard_type} onChange={(e) => handleChange('hazard_type', e.target.value)}>
							<option>Flooding</option>
							<option>Road Blockage</option>
							<option>Landslide</option>
							<option>Electrical Risk</option>
							<option>Fire</option>
							<option>Other</option>
						</select>

						<label>
							Location *
							{geocoding && <span className="hr-geocoding"> · Detecting place name…</span>}
						</label>
						<input
							type="text"
							placeholder="Barangay / street — or tap the map to pin"
							value={form.location}
							onChange={(e) => handleChange('location', e.target.value)}
						/>

						{/* ── Map picker ── */}
						<div className="hr-map-wrap">
							<p className="hr-map-hint">
								<span className="material-symbols-outlined" aria-hidden="true">touch_app</span>
								Tap the map to drop a pin, or press <strong>Use GPS</strong>.
							</p>
							<MapContainer
								center={pin ? [pin.lat, pin.lon] : BULACAN_CENTER}
								zoom={pin ? 15 : 11}
								className="hr-map"
								scrollWheelZoom
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<ClickToPin onPin={handlePin} />
								<GpsLocator onPin={handlePin} />
								{pin && <Marker position={[pin.lat, pin.lon]} />}
							</MapContainer>
							{pin && (
								<p className="hr-coords">
									<span className="material-symbols-outlined" aria-hidden="true">location_on</span>
									{pin.lat.toFixed(5)}°N, {pin.lon.toFixed(5)}°E
									<button type="button" className="hr-clear-pin" onClick={clearPin}>✕ Clear pin</button>
								</p>
							)}
						</div>

						<label>Description *</label>
						<textarea
							rows="4"
							placeholder="Describe what happened..."
							value={form.description}
							onChange={(e) => handleChange('description', e.target.value)}
						/>

						<button type="submit" className="btn-inline danger" disabled={loading}>
							{loading ? 'Submitting…' : 'Submit Report'}
						</button>
					</form>

					<div className="card" style={{ gridColumn: 'span 5' }}>
						<h3>Reporting Tips</h3>
						<ul className="item-list">
							<li>Provide exact landmarks.</li>
							<li>Add clear and concise details.</li>
							<li>Indicate if route is fully blocked.</li>
							<li>Share urgent reports immediately.</li>
						</ul>
						<div className="tag-cluster">
							<span className="ghost-tag">Flooded Road</span>
							<span className="ghost-tag">Debris</span>
							<span className="ghost-tag">Powerline Risk</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default HazardReportPage;

