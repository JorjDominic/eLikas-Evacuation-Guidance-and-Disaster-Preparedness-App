import React from 'react';
import '../../styles/shared/sentinel.css';

function AdminDashboardPage({ user, onLogout }) {
	const stats = [
		{ label: 'Total Users', value: 2481 },
		{ label: 'Centers Managed', value: 14 },
		{ label: 'Open Alerts', value: 3 },
		{ label: 'Pending Reports', value: 18 }
	];

	const tasks = [
		'Review 4 newly submitted hazard reports',
		'Update flood advisory for Bocaue area',
		'Publish quarterly preparedness bulletin'
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
					{stats.map((item) => (
						<div key={item.label} className="metric">
							<span>{item.label}</span>
							<strong>{item.value}</strong>
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
							<li>Report Moderation: In progress</li>
						</ul>
					</div>

					<div className="card" style={{ gridColumn: 'span 6' }}>
						<h2>Admin Tasks</h2>
						<ul className="item-list">
							{tasks.map((task) => (
								<li key={task}>{task}</li>
							))}
						</ul>
						<div className="action-row">
							<button type="button" className="btn-inline">Manage Alerts</button>
							<button type="button" className="btn-inline primary">Manage Centers</button>
						</div>
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
			</div>
		</section>
	);
}

export default AdminDashboardPage;

