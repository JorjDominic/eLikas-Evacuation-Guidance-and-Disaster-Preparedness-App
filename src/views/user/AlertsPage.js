import React from 'react';
import '../../styles/shared/sentinel.css';

function AlertsPage() {
	const alerts = [
		{ title: 'Typhoon Alert: Signal No. 3', area: 'Bulacan North', time: '10 minutes ago', level: 'high' },
		{ title: 'Flood Warning', area: 'Angat spillway area', time: '35 minutes ago', level: 'medium' },
		{ title: 'Heat Advisory', area: 'Province-wide', time: '2 hours ago', level: 'low' }
	];

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

				<div className="alert-feed">
					{alerts.map((alert) => (
						<article key={alert.title} className="alert-row">
							<div>
								<h3>{alert.title}</h3>
								<p><strong>Affected Area:</strong> {alert.area}</p>
								<small>{alert.time}</small>
							</div>
							<div className="action-row">
								<span className={`status-pill ${alert.level}`}>{alert.level}</span>
								<button type="button" className="btn-inline">View Details</button>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default AlertsPage;

