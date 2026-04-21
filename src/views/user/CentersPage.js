import React from 'react';
import '../../styles/shared/sentinel.css';

function CentersPage() {
	const centers = [
		{ name: 'Malolos Convention Center', location: 'Malolos City', occupancy: 64, capacity: '3200 / 5000', status: 'Open' },
		{ name: 'SJDM Sports Complex', location: 'San Jose del Monte', occupancy: 56, capacity: '4500 / 8000', status: 'Open' },
		{ name: 'Bocaue National High School', location: 'Bocaue', occupancy: 20, capacity: '900 / 4500', status: 'Open' },
		{ name: 'Norzagaray Hall Complex', location: 'Norzagaray', occupancy: 70, capacity: '1750 / 2500', status: 'Open' }
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Evacuation Centers</h1>
					<p>Compare shelter readiness, occupancy pressure, and essential services before you travel.</p>
					<div className="hero-meta">
						<span className="hero-pill">Live Capacity Feed</span>
						<span className="hero-pill">Map-Verified Locations</span>
					</div>
				</div>

				<h2 className="section-title">Available Shelters</h2>
				<div className="soft-grid">
					{centers.map((center) => (
						<div key={center.name} className="soft-card">
							<div className="app-page-head" style={{ marginBottom: '0.4rem', alignItems: 'center' }}>
								<h3>{center.name}</h3>
								<span className="status-pill open">{center.status}</span>
							</div>
							<p>{center.location}</p>
							<p><strong>Capacity:</strong> {center.capacity}</p>
							<div className="progress-wrap">
								<div style={{ width: `${center.occupancy}%` }}></div>
							</div>
							<small>{center.occupancy}% occupied now</small>
							<div className="tag-cluster">
								<span className="ghost-tag">Water Station</span>
								<span className="ghost-tag">Medical Desk</span>
								<span className="ghost-tag">Charging Hub</span>
							</div>
							<div className="action-row" style={{ marginTop: '0.6rem' }}>
								<button type="button" className="btn-inline primary">Open Details</button>
								<button type="button" className="btn-inline">Route</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default CentersPage;

