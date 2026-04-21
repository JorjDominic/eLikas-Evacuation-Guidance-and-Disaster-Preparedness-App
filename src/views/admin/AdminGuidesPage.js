import React from 'react';
import '../../styles/shared/sentinel.css';

function AdminGuidesPage() {
	const guides = [
		{ title: 'Typhoon Preparedness', type: 'Guide' },
		{ title: 'Flood Evacuation Checklist', type: 'Guide' },
		{ title: 'Malolos North Route', type: 'Route' },
		{ title: 'SJDM Safe Path', type: 'Route' }
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Manage Guides and Routes</h1>
					<p>Curate preparedness modules and keep evacuation route instructions clear, current, and actionable.</p>
					<div className="hero-meta">
						<span className="hero-pill">Learning Content Desk</span>
						<span className="hero-pill">Version Controlled Updates</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Guide Publishing</span>
					<button type="button" className="btn-inline primary">+ Add Content</button>
				</div>
				<div className="soft-grid">
					{guides.map((item) => (
						<div key={item.title} className="soft-card">
							<span className="page-chip">{item.type}</span>
							<h3>{item.title}</h3>
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

export default AdminGuidesPage;

