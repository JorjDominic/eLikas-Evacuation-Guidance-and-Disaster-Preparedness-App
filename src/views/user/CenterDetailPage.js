import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';

function CenterDetailPage({ centerId, onBack }) {
	const [center, setCenter] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!centerId) {
			setError('No center selected.');
			setLoading(false);
			return;
		}

		async function fetchCenter() {
			const { data, error: err } = await supabase
				.from('evacuation_centers')
				.select('*')
				.eq('id', centerId)
				.single();
			if (err) setError(err.message);
			else setCenter(data);
			setLoading(false);
		}

		fetchCenter();
	}, [centerId]);

	if (loading) {
		return (
			<section className="app-page">
				<div className="app-shell"><p>Loading center details…</p></div>
			</section>
		);
	}

	if (error || !center) {
		return (
			<section className="app-page">
				<div className="app-shell">
					<p style={{ color: 'var(--color-danger, red)', marginBottom: '1rem' }}>{error || 'Center not found.'}</p>
					<button type="button" className="btn-inline" onClick={onBack}>← Back to Centers</button>
				</div>
			</section>
		);
	}

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>{center.name}</h1>
					<p>Facility profile for evacuation planning, family relocation, and resource coordination.</p>
					<div className="hero-meta">
						<span className="hero-pill">Status: {center.status}</span>
						<span className="hero-pill">Capacity: {center.current_occupancy ?? 0} / {center.capacity}</span>
					</div>
				</div>

				<div className="app-page-head">
					<button type="button" className="btn-inline" onClick={onBack}>← Back to Centers</button>
				</div>

				<h2 className="section-title">Center Operations</h2>
				<div className="panel-grid">
					<div className="card" style={{ gridColumn: 'span 4' }}>
						<h3>Center Information</h3>
						<div className="kv-list">
							<div className="kv-row">
								<span>Location</span>
								<strong>{center.municipality}{center.barangay ? `, ${center.barangay}` : ''}</strong>
							</div>
							{center.address && (
								<div className="kv-row">
									<span>Address</span>
									<strong>{center.address}</strong>
								</div>
							)}
							<div className="kv-row">
								<span>Current Occupancy</span>
								<strong>{center.current_occupancy ?? 0} / {center.capacity}</strong>
							</div>
							{center.contact_person && (
								<div className="kv-row">
									<span>Contact Person</span>
									<strong>{center.contact_person}</strong>
								</div>
							)}
							{center.contact_number && (
								<div className="kv-row">
									<span>Contact Number</span>
									<strong>{center.contact_number}</strong>
								</div>
							)}
						</div>
					</div>

					<div className="card" style={{ gridColumn: 'span 4' }}>
						<h3>Facilities</h3>
						{center.facilities?.length > 0 ? (
							<ul className="item-list">
								{center.facilities.map((facility) => (
									<li key={facility}>{facility}</li>
								))}
							</ul>
						) : (
							<p>No facilities listed.</p>
						)}
					</div>

					{center.latitude && center.longitude && (
						<div className="card" style={{ gridColumn: 'span 4' }}>
							<h3>Coordinates</h3>
							<div className="kv-list">
								<div className="kv-row"><span>Latitude</span><strong>{center.latitude}</strong></div>
								<div className="kv-row"><span>Longitude</span><strong>{center.longitude}</strong></div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default CenterDetailPage;

