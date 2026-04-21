import React from 'react';
import '../../styles/shared/sentinel.css';

function AdminAlertsPage() {
	const alerts = [
		{ title: 'Typhoon Signal Update', level: 'High', area: 'North Bulacan' },
		{ title: 'Flood Watch', level: 'Medium', area: 'Angat and nearby barangays' },
		{ title: 'Heat Advisory', level: 'Low', area: 'Province-wide' }
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Manage Alerts</h1>
					<p>Create targeted warnings, tune severity levels, and publish verified updates to residents and responders.</p>
					<div className="hero-meta">
						<span className="hero-pill">Broadcast Console</span>
						<span className="hero-pill">Multi-Channel Delivery</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Advisory Management</span>
					<button type="button" className="btn-inline primary">+ Create Alert</button>
				</div>
				<div className="soft-grid">
					{alerts.map((alert) => (
						<div key={alert.title} className="soft-card">
							<h3>{alert.title}</h3>
							<p><strong>Severity:</strong> <span className={`status-pill ${alert.level.toLowerCase()}`}>{alert.level}</span></p>
							<p><strong>Area:</strong> {alert.area}</p>
							<div className="action-row">
								<button type="button" className="btn-inline">Edit</button>
								<button type="button" className="btn-inline danger">Delete</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default AdminAlertsPage;

