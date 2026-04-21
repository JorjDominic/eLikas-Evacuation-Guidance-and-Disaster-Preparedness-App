import React from 'react';
import '../../styles/shared/sentinel.css';

function AdminReportsPage() {
	const reports = [
		{ id: 'RPT-001', issue: 'Flooded Underpass', location: 'Bocaue', status: 'Pending' },
		{ id: 'RPT-002', issue: 'Blocked Access Road', location: 'Malolos', status: 'Approved' },
		{ id: 'RPT-003', issue: 'Power Line Hazard', location: 'SJDM', status: 'Pending' }
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Moderate Hazard Reports</h1>
					<p>Validate field submissions, mark response status, and route high-risk incidents to appropriate teams.</p>
					<div className="hero-meta">
						<span className="hero-pill">Incident Queue</span>
						<span className="hero-pill">Triage Priority Enabled</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Moderation Console</span>
				</div>

				<div className="sub-grid" style={{ marginBottom: '0.9rem' }}>
					<div className="subtle-card" style={{ gridColumn: 'span 8' }}>
						<h3>Current Focus</h3>
						<p>Prioritize reports near schools, hospitals, and bridges before broad community incidents.</p>
					</div>
					<div className="subtle-card" style={{ gridColumn: 'span 4' }}>
						<h3>Pending Validation</h3>
						<p>12 reports awaiting location confirmation.</p>
					</div>
				</div>

				<div className="table-shell card">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Issue</th>
							<th>Location</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{reports.map((report) => (
							<tr key={report.id}>
								<td>{report.id}</td>
								<td>{report.issue}</td>
								<td>{report.location}</td>
								<td><span className={`status-pill ${report.status.toLowerCase()}`}>{report.status}</span></td>
								<td>
									<button type="button" className="btn-inline" style={{ marginRight: '0.4rem' }}>Approve</button>
									<button type="button" className="btn-inline danger">Reject</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				</div>
			</div>
		</section>
	);
}

export default AdminReportsPage;

