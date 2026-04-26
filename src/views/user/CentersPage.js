import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';

function CentersPage({ onSelectCenter }) {
	const [centers, setCenters] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchCenters() {
			const { data, error: err } = await supabase
				.from('evacuation_centers')
				.select('*')
				.order('municipality', { ascending: true });
			if (err) setError(err.message);
			else setCenters(data || []);
			setLoading(false);
		}
		fetchCenters();
	}, []);

	const occupancyPercent = (center) => {
		if (!center.capacity) return 0;
		return Math.min(100, Math.round(((center.current_occupancy || 0) / center.capacity) * 100));
	};

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

				{loading && <p>Loading centers…</p>}
				{error && <p style={{ color: 'var(--color-danger, red)' }}>{error}</p>}

				{!loading && !error && centers.length === 0 && (
					<p>No evacuation centers found.</p>
				)}

				{!loading && centers.length > 0 && (
					<>
						<h2 className="section-title">Available Shelters</h2>
						<div className="soft-grid">
							{centers.map((center) => {
								const pct = occupancyPercent(center);
								return (
									<div key={center.id} className="soft-card">
										<div className="app-page-head" style={{ marginBottom: '0.4rem', alignItems: 'center' }}>
											<h3>{center.name}</h3>
											<span className={`status-pill ${center.status}`}>{center.status}</span>
										</div>
										<p>{center.municipality}{center.barangay ? `, ${center.barangay}` : ''}</p>
										<p><strong>Capacity:</strong> {center.current_occupancy ?? 0} / {center.capacity}</p>
										<div className="progress-wrap">
											<div style={{ width: `${pct}%` }}></div>
										</div>
										<small>{pct}% occupied now</small>
										{center.facilities?.length > 0 && (
											<div className="tag-cluster">
												{center.facilities.slice(0, 3).map((f) => (
													<span key={f} className="ghost-tag">{f}</span>
												))}
											</div>
										)}
										<div className="action-row" style={{ marginTop: '0.6rem' }}>
											<button
												type="button"
												className="btn-inline primary"
												onClick={() => onSelectCenter(center.id)}
											>
												Open Details
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		</section>
	);
}

export default CentersPage;

