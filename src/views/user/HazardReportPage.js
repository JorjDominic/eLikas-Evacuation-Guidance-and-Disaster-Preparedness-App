import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';

function HazardReportPage() {
	const [form, setForm] = useState({
		hazard_type: 'Flooding',
		location: '',
		description: ''
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (!form.location.trim()) {
			setError('Please enter a location.');
			return;
		}

		if (!form.description.trim()) {
			setError('Please describe the hazard.');
			return;
		}

		setLoading(true);
		const { error: err } = await supabase.from('hazard_reports').insert([{
			hazard_type: form.hazard_type,
			location: form.location.trim(),
			description: form.description.trim(),
			status: 'pending'
		}]);
		setLoading(false);

		if (err) {
			setError(err.message);
			return;
		}

		setSuccess('Report submitted. Our team will review it shortly.');
		setForm({ hazard_type: 'Flooding', location: '', description: '' });
	};

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
					<form className="card" style={{ gridColumn: 'span 7', display: 'grid', gap: '0.45rem' }} onSubmit={handleSubmit}>
						{error && <div className="sb-auth-error">{error}</div>}
						{success && <div className="sb-auth-message">{success}</div>}

						<label>Hazard Type</label>
						<select value={form.hazard_type} onChange={(e) => handleChange('hazard_type', e.target.value)}>
							<option>Flooding</option>
							<option>Road Blockage</option>
							<option>Landslide</option>
							<option>Electrical Risk</option>
						</select>

						<label>Location *</label>
						<input
							type="text"
							placeholder="Barangay / street"
							value={form.location}
							onChange={(e) => handleChange('location', e.target.value)}
						/>

						<label>Description *</label>
						<textarea
							rows="4"
							placeholder="Describe what happened..."
							value={form.description}
							onChange={(e) => handleChange('description', e.target.value)}
						/>

						<button type="submit" className="btn-inline danger" disabled={loading}>
							{loading ? 'Submitting…' : 'Submit Report'}
						</button>
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

