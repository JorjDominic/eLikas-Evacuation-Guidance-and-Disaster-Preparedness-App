import React, { useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';
import WeatherWidget from '../../components/WeatherWidget';

function AdminDashboardPage({ user, onLogout }) {
	const [stats, setStats]           = useState({ users: '—', centers: '—', alerts: '—', pending: '—' });
	const [pendingReports, setPendingReports] = useState([]);
	const [loading, setLoading]       = useState(true);

	useEffect(() => {
		async function loadData() {
			const [usersRes, centersRes, alertsRes, pendingRes, reportsRes] = await Promise.all([
				supabase.from('profiles').select('id', { count: 'exact', head: true }),
				supabase.from('evacuation_centers').select('id', { count: 'exact', head: true }),
				supabase.from('alerts').select('id', { count: 'exact', head: true }),
				supabase.from('hazard_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
				supabase.from('hazard_reports').select('id, hazard_type, location, created_at')
					.eq('status', 'pending')
					.order('created_at', { ascending: false })
					.limit(4)
			]);

			setStats({
				users:   usersRes.count   ?? 0,
				centers: centersRes.count ?? 0,
				alerts:  alertsRes.count  ?? 0,
				pending: pendingRes.count ?? 0,
			});

			setPendingReports(reportsRes.data || []);
			setLoading(false);
		}
		loadData();
	}, []);

	const metricCards = [
		{ label: 'Total Users',     value: stats.users   },
		{ label: 'Centers Managed', value: stats.centers },
		{ label: 'Open Alerts',     value: stats.alerts  },
		{ label: 'Pending Reports', value: stats.pending },
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Operations Command Dashboard</h1>
					<p>Welcome, {user?.name || 'Admin'}. Coordinate alerts, field reports, and shelter decisions from a single operational board.</p>
					<div className="hero-meta">
						<span className="hero-pill">Command Session Active</span>
						<span className="hero-pill">System Health: Stable</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Admin Operations</span>
					<button className="btn-inline danger" onClick={onLogout}>Sign Out</button>
				</div>

				<div className="metrics-grid">
					{metricCards.map((item) => (
						<div key={item.label} className="metric">
							<span>{item.label}</span>
							<strong>{loading ? '…' : item.value}</strong>
						</div>
					))}
				</div>

				<div className="panel-grid">
					<div className="card" style={{ gridColumn: 'span 6' }}>
						<h2>System Status</h2>
						<ul className="item-list">
							<li>API Services: Operational</li>
							<li>Notification Queue: Healthy</li>
							<li>Center Data Sync: Up to date</li>
							<li>Report Moderation: {loading ? '…' : `${stats.pending} pending`}</li>
						</ul>
					</div>

					<div className="card" style={{ gridColumn: 'span 6' }}>
						<h2>Pending Hazard Reports</h2>
						{loading && <p>Loading…</p>}
						{!loading && pendingReports.length === 0 && <p>No pending reports. All clear.</p>}
						<ul className="item-list">
							{pendingReports.map((r) => (
								<li key={r.id}>
									<strong>{r.hazard_type}</strong> — {r.location}
									<br />
									<small>{new Date(r.created_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="sub-grid" style={{ marginTop: '0.9rem' }}>
					<div className="subtle-card" style={{ gridColumn: 'span 8' }}>
						<h3>Operational Focus</h3>
						<p>Tonight's highest priority is validating reports from low-lying barangays before route recommendations are pushed to residents.</p>
					</div>
					<div className="subtle-card" style={{ gridColumn: 'span 4' }}>
						<h3>Next Broadcast</h3>
						<p>Preparedness bulletin scheduled for 18:00 with flood and transport updates.</p>
					</div>
				</div>

				{/* Live Weather & Risk Overview */}
				<div className="panel-grid" style={{ marginTop: '0.9rem' }}>
					<div style={{ gridColumn: 'span 12' }}>
						<WeatherWidget compact />
					</div>
				</div>
			</div>
		</section>
	);
}

export default AdminDashboardPage;

