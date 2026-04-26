import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';

function AdminReportsPage() {
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	const fetchReports = useCallback(async () => {
		setLoading(true);
		const { data, error: err } = await supabase
			.from('hazard_reports')
			.select('*')
			.order('created_at', { ascending: false });
		if (err) setError(err.message);
		else setReports(data || []);
		setLoading(false);
	}, []);

	useEffect(() => { fetchReports(); }, [fetchReports]);

	const updateStatus = async (id, status) => {
		const { error: err } = await supabase
			.from('hazard_reports')
			.update({ status })
			.eq('id', id);
		if (err) { setError(err.message); return; }
		await fetchReports();
	};

	const pendingCount = reports.filter((r) => r.status === 'pending').length;

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
						<p>{loading ? '…' : `${pendingCount} report${pendingCount !== 1 ? 's' : ''} awaiting review.`}</p>
					</div>
				</div>

				{error && <p style={{ color: 'var(--color-danger, red)', marginBottom: '0.75rem' }}>{error}</p>}
				{loading && <p>Loading reports…</p>}

				{!loading && (
					<div className="table-shell card">
						<table>
							<thead>
								<tr>
									<th>Type</th>
									<th>Location</th>
									<th>Description</th>
									<th>Date</th>
									<th>Status</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{reports.length === 0 ? (
									<tr><td colSpan="6" style={{ textAlign: 'center' }}>No reports found.</td></tr>
								) : (
									reports.map((report) => (
										<tr key={report.id}>
											<td>{report.hazard_type}</td>
											<td>{report.location}</td>
											<td>{report.description}</td>
											<td><small>{new Date(report.created_at).toLocaleDateString()}</small></td>
											<td><span className={`status-pill ${report.status}`}>{report.status}</span></td>
											<td>
												{report.status === 'pending' ? (
													<>
														<button
															type="button"
															className="btn-inline"
															style={{ marginRight: '0.4rem' }}
															onClick={() => updateStatus(report.id, 'approved')}
														>
															Approve
														</button>
														<button
															type="button"
															className="btn-inline danger"
															onClick={() => updateStatus(report.id, 'rejected')}
														>
															Reject
														</button>
													</>
												) : (
													<span style={{ opacity: 0.5 }}>—</span>
												)}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</section>
	);
}

export default AdminReportsPage;

