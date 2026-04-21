import React from 'react';
import '../../styles/shared/sentinel.css';

function GuidesPage() {
	const guides = [
		{ title: 'Typhoon Readiness', summary: 'Prepare kits, secure windows, and monitor advisories.' },
		{ title: 'Flood Safety', summary: 'Move to higher ground and avoid crossing floodwaters.' },
		{ title: 'Earthquake Response', summary: 'Drop, cover, and hold on until shaking stops.' }
	];

	const routes = [
		{ path: 'Malolos North Route', eta: '8 mins', note: 'Low congestion' },
		{ path: 'Bocaue East Route', eta: '12 mins', note: 'Road narrowing near bridge' },
		{ path: 'SJDM West Route', eta: '16 mins', note: 'Monitor traffic at junction' }
	];

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Safety Guides</h1>
					<p>Practical playbooks for typhoon, flood, and earthquake response tailored to community conditions.</p>
					<div className="hero-meta">
						<span className="hero-pill">Resident Learning Hub</span>
						<span className="hero-pill">Translated and Localized</span>
					</div>
				</div>

				<div className="sub-grid" style={{ marginBottom: '0.9rem' }}>
					<div className="subtle-card" style={{ gridColumn: 'span 8' }}>
						<h3>Featured Protocol</h3>
						<p>72-hour flood readiness protocol now includes child-safe packing checklist and evacuation buddy process for senior citizens.</p>
					</div>
					<div className="subtle-card" style={{ gridColumn: 'span 4' }}>
						<h3>Estimated Prep Time</h3>
						<p>Most households can complete baseline kit setup in 25 to 40 minutes.</p>
					</div>
				</div>

				<h2 className="section-title">Preparedness Guides</h2>
				<div className="soft-grid" style={{ marginBottom: '0.9rem' }}>
					{guides.map((guide) => (
						<div key={guide.title} className="soft-card">
							<h3>{guide.title}</h3>
							<p>{guide.summary}</p>
							<button type="button" className="btn-inline">Read Guide</button>
						</div>
					))}
				</div>

				<h2 className="section-title">Evacuation Routes</h2>
				<div className="soft-grid">
					{routes.map((route) => (
						<div key={route.path} className="soft-card">
							<h4>{route.path}</h4>
							<p>Estimated Time: {route.eta}</p>
							<small>{route.note}</small>
							<div className="action-row" style={{ marginTop: '0.55rem' }}>
								<button type="button" className="btn-inline">Open Route</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default GuidesPage;

