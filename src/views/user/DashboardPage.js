import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';
import WeatherWidget from '../../components/WeatherWidget';

function DashboardPage({ user, onNavigate }) {
	const [stats, setStats]     = useState({ alerts: '—', centers: '—', routes: '—' });
	const [recentAlerts, setRecentAlerts] = useState([]);
	const [topAlert, setTopAlert]         = useState(null);
	const [syncedAt, setSyncedAt]         = useState('');
	const [loading, setLoading]           = useState(true);

	useEffect(() => {
		async function loadData() {
			const [alertsRes, centersRes, routesRes, recentRes] = await Promise.all([
				supabase.from('alerts').select('id', { count: 'exact', head: true }),
				supabase.from('evacuation_centers').select('id', { count: 'exact', head: true }).eq('status', 'open'),
				supabase.from('evacuation_routes').select('id', { count: 'exact', head: true }).eq('status', 'active'),
				supabase.from('alerts').select('id, title, level, created_at').order('created_at', { ascending: false }).limit(5)
			]);

			setStats({
				alerts:  alertsRes.count  ?? 0,
				centers: centersRes.count ?? 0,
				routes:  routesRes.count  ?? 0,
			});

			const items = recentRes.data || [];
			setRecentAlerts(items);
			setTopAlert(items.find((a) => a.level === 'high') || items[0] || null);
			setSyncedAt(new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }));
			setLoading(false);
		}
		loadData();
	}, []);

	const metricCards = [
		{ label: 'Active Alerts',   icon: '🚨', value: stats.alerts,  tone: 'danger'  },
		{ label: 'Open Centers',    icon: '🏠', value: stats.centers, tone: 'primary' },
		{ label: 'Active Routes',   icon: '🛣️', value: stats.routes,  tone: 'success' },
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Community Dashboard</h1>
					<p>Welcome back, {user?.name || 'Resident'}. This board summarizes live conditions, shelter readiness, and the next best actions for your household.</p>
					<div className="hero-meta">
						<span className="hero-pill">Bulacan Watch Mode</span>
						{syncedAt && <span className="hero-pill">Data Synced {syncedAt}</span>}
						<span className="hero-pill">Response Tier: Advisory</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Resident Control Panel</span>
				</div>

				<div className="metrics-grid">
					{metricCards.map((item) => (
						<div key={item.label} className={`metric ${item.tone}`}>
							<span className="metric__icon">{item.icon}</span>
							<span>{item.label}</span>
							<strong>{loading ? '…' : item.value}</strong>
						</div>
					))}
				</div>

				<div className="panel-grid">
					<div className="card" style={{ gridColumn: 'span 7' }}>
						<h2>Recent Alerts</h2>
						{loading && <p>Loading…</p>}
						{!loading && recentAlerts.length === 0 && (
							<div className="info-strip ok" style={{ marginTop: '0.5rem' }}>
								<span>✅</span>
								<span>No active alerts at this time. All conditions normal.</span>
							</div>
						)}
						<ul className="timeline-stack" style={{ marginTop: '0.5rem' }}>
							{recentAlerts.map((a) => (
								<li key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
									<span className={`status-pill ${a.level}`}>{a.level}</span>
									<span style={{ fontSize: '0.9rem', flex: 1 }}>{a.title}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="card" style={{ gridColumn: 'span 5' }}>
						<h2>Quick Actions</h2>
						<div className="action-row">
							<button type="button" className="btn-inline primary" onClick={() => onNavigate('centers')}>Find Center</button>
							<button type="button" className="btn-inline" onClick={() => onNavigate('alerts')}>View Alerts</button>
							<button type="button" className="btn-inline" onClick={() => onNavigate('guides')}>Open Guides</button>
							<button type="button" className="btn-inline danger" onClick={() => onNavigate('hazard-report')}>Report Hazard</button>
						</div>
						<div className="info-strip" style={{ marginTop: '0.85rem', marginBottom: 0 }}>
							<span>💡</span>
							<span>Prepare a 72-hour go-bag, know your nearest evacuation center, and keep emergency contacts updated.</span>
						</div>
					</div>
				</div>

				{/* Weather Forecast & Preparedness */}
				<div className="panel-grid" style={{ marginTop: '0.9rem' }}>
					<div style={{ gridColumn: 'span 12' }}>
						<WeatherWidget />
					</div>
				</div>

				{topAlert && (
					<>
					<hr className="section-divider" />
					<div className="sub-grid">
						<div className="subtle-card card--danger" style={{ gridColumn: 'span 8' }}>
							<h3>🔴 Priority Advisory</h3>
							<p>{topAlert.title}</p>
						</div>
						<div className="subtle-card" style={{ gridColumn: 'span 4' }}>
							<h3>⚡ Response Tip</h3>
							<p>Charge devices now and assign one family contact to monitor verified announcements.</p>
						</div>
					</div>
					</>
				)}
			</div>
		</section>
	);
}

export default DashboardPage;

