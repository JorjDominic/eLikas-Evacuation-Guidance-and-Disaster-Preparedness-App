import React from 'react';
import '../../styles/shared/sentinel.css';

function DashboardPage({ user, onNavigate }) {
	const stats = [
		{ label: 'Active Alerts', value: 3, tone: 'danger' },
		{ label: 'Nearby Centers', value: 6, tone: 'primary' },
		{ label: 'Safe Routes', value: 9, tone: 'success' },
		{ label: 'Unread Advisories', value: 2, tone: 'warning' }
	];

	const updates = [
		'Flood advisory in Angat spillway area',
		'Center capacity updated for Malolos Convention Center',
		'New typhoon preparedness guide published'
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Community Dashboard</h1>
					<p>Welcome back, {user?.name || 'Resident'}. This board summarizes live conditions, shelter readiness, and the next best actions for your household.</p>
					<div className="hero-meta">
						<span className="hero-pill">Bulacan Watch Mode</span>
						<span className="hero-pill">Data Synced 2 min ago</span>
						<span className="hero-pill">Response Tier: Advisory</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Resident Control Panel</span>
					
				</div>

				<div className="metrics-grid">
					{stats.map((item) => (
						<div key={item.label} className={`metric ${item.tone}`}>
							<span>{item.label}</span>
							<strong>{item.value}</strong>
						</div>
					))}
				</div>

				<div className="panel-grid">
					<div className="card" style={{ gridColumn: 'span 7' }}>
						<h2>Recent Situation Updates</h2>
						<ul className="item-list">
							{updates.map((update) => (
								<li key={update}>{update}</li>
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
						<div className="tag-cluster">
							<span className="ghost-tag">Flood</span>
							<span className="ghost-tag">Evacuation</span>
							<span className="ghost-tag">Family Checklist</span>
						</div>
					</div>
				</div>

				<div className="sub-grid" style={{ marginTop: '0.9rem' }}>
					<div className="subtle-card" style={{ gridColumn: 'span 8' }}>
						<h3>Priority Advisory</h3>
						<p>Families near riverbanks in Hagonoy and Calumpit are advised to prepare transport options before 8:00 PM due to possible spillway discharge.</p>
					</div>
					<div className="subtle-card" style={{ gridColumn: 'span 4' }}>
						<h3>Response Tip</h3>
						<p>Charge devices now and assign one family contact to monitor verified announcements.</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default DashboardPage;

