import React from 'react';
import '../../styles/shared/sentinel.css';

function CenterDetailPage() {
	const facilities = ['Medical Assistance', 'Food Packs', 'Water', 'Charging', 'Child Safe Area', 'Sanitation'];
	const routeSteps = [
		'Proceed to MacArthur Highway',
		'Turn right to bypass road near barangay hall',
		'Follow evacuation signboards to main gate'
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Malolos Convention Center</h1>
					<p>Facility profile for evacuation planning, family relocation, and resource coordination.</p>
					<div className="hero-meta">
						<span className="hero-pill">Status: Open</span>
						<span className="hero-pill">Capacity: 3200 / 5000</span>
						<span className="hero-pill">Check-in Avg: 5 mins</span>
					</div>
				</div>

				<h2 className="section-title">Center Operations</h2>
				<div className="panel-grid">
					<div className="card" style={{ gridColumn: 'span 4' }}>
						<h3>Center Information</h3>
						<div className="kv-list">
							<div className="kv-row"><span>Location</span><strong>Malolos City, Bulacan</strong></div>
							<div className="kv-row"><span>Current Capacity</span><strong>3200 / 5000</strong></div>
							<div className="kv-row"><span>Hotline</span><strong>+63 44 812 3456</strong></div>
							<div className="kv-row"><span>Power Backup</span><strong>Available</strong></div>
						</div>
					</div>

					<div className="card" style={{ gridColumn: 'span 4' }}>
						<h3>Facilities</h3>
						<ul className="item-list">
							{facilities.map((facility) => (
								<li key={facility}>{facility}</li>
							))}
						</ul>
					</div>

					<div className="card" style={{ gridColumn: 'span 4' }}>
						<h3>Recommended Route</h3>
						<ol className="timeline-stack">
							{routeSteps.map((step) => (
								<li key={step}>{step}</li>
							))}
						</ol>
						<div className="action-row" style={{ marginTop: '0.6rem' }}>
							<button type="button" className="btn-inline primary">Start Route</button>
							<button type="button" className="btn-inline">Call Center</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default CenterDetailPage;

