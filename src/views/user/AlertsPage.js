import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';
import WeatherWidget from '../../components/WeatherWidget';

function AlertsPage() {
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

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

				{loading && <p>Loading alerts…</p>}
				{error && <p style={{ color: 'var(--color-danger, red)' }}>{error}</p>}
				{!loading && !error && alerts.length === 0 && (
					<p>No active alerts at this time.</p>
				)}

				<div className="alert-feed">
					{alerts.map((alert) => (
						<article key={alert.id} className="alert-row">
							<div>
								<h3>{alert.title}</h3>
								<p><strong>Affected Area:</strong> {alert.area}</p>
								<small>{new Date(alert.created_at).toLocaleString()}</small>
							</div>
							<div className="action-row">
								<span className={`status-pill ${alert.level}`}>{alert.level}</span>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default AlertsPage;

