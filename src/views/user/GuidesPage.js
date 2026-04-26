import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';

function GuidesPage() {
	const [guides, setGuides] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchGuides() {
			const { data, error: err } = await supabase
				.from('guides')
				.select('*')
				.order('created_at', { ascending: false });
			if (err) setError(err.message);
			else setGuides(data || []);
			setLoading(false);
		}
		fetchGuides();
	}, []);

	const typeGuides = guides.filter((g) => g.type === 'Guide');
	const typeRoutes = guides.filter((g) => g.type === 'Route');

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

				{loading && <p>Loading guides…</p>}
				{error && <p style={{ color: 'var(--color-danger, red)' }}>{error}</p>}

				{!loading && !error && (
					<>
						<h2 className="section-title">Preparedness Guides</h2>
						{typeGuides.length === 0 ? (
							<p>No guides available yet.</p>
						) : (
							<div className="soft-grid" style={{ marginBottom: '0.9rem' }}>
								{typeGuides.map((guide) => (
									<div key={guide.id} className="soft-card">
										<h3>{guide.title}</h3>
										{guide.content && <p>{guide.content}</p>}
									</div>
								))}
							</div>
						)}

						<h2 className="section-title">Evacuation Routes</h2>
						{typeRoutes.length === 0 ? (
							<p>No routes available yet.</p>
						) : (
							<div className="soft-grid">
								{typeRoutes.map((route) => (
									<div key={route.id} className="soft-card">
										<h4>{route.title}</h4>
										{route.content && <p>{route.content}</p>}
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
}

export default GuidesPage;

