import React from 'react';
import '../../styles/shared/sentinel.css';

function HazardReportPage() {
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
					<form className="card" style={{ gridColumn: 'span 7', display: 'grid', gap: '0.45rem' }}>
						<label>Hazard Type</label>
						<select>
							<option>Flooding</option>
							<option>Road Blockage</option>
							<option>Landslide</option>
							<option>Electrical Risk</option>
						</select>

						<label>Location</label>
						<input type="text" placeholder="Barangay / street" />

						<label>Description</label>
						<textarea rows="4" placeholder="Describe what happened..." />

						<button type="button" className="btn-inline danger">Submit Report</button>
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

