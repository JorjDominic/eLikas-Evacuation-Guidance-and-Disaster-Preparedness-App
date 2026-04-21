import React from 'react';
import '../../styles/shared/sentinel.css';

function AdminCentersPage() {
	const centers = [
		{ name: 'Malolos Convention Center', location: 'Malolos', occupancy: '3200/5000', status: 'Open' },
		{ name: 'Bocaue NHS', location: 'Bocaue', occupancy: '900/4500', status: 'Open' },
		{ name: 'Norzagaray Hall Complex', location: 'Norzagaray', occupancy: '1750/2500', status: 'Open' }
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Manage Centers</h1>
					<p>Keep shelter profiles accurate, publish occupancy changes, and mark operational constraints in real time.</p>
					<div className="hero-meta">
						<span className="hero-pill">Shelter Operations Desk</span>
						<span className="hero-pill">Auto-sync Every 3 Minutes</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Center Administration</span>
					<button type="button" className="btn-inline primary">+ Add Center</button>
				</div>
				<div className="table-shell card">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Location</th>
							<th>Occupancy</th>
							<th>Status</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{centers.map((center) => (
							<tr key={center.name}>
								<td>{center.name}</td>
								<td>{center.location}</td>
								<td>{center.occupancy}</td>
								<td><span className="status-pill open">{center.status}</span></td>
								<td><button type="button" className="btn-inline">Edit</button></td>
							</tr>
						))}
					</tbody>
				</table>
				</div>
			</div>
		</section>
	);
}

export default AdminCentersPage;

