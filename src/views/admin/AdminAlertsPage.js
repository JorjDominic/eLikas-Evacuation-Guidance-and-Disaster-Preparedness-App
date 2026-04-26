import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';
import '../../styles/admin/AdminCentersPage.css';

const EMPTY_ALERT = { title: '', level: 'medium', area: '', description: '' };

function AlertModal({ initial, onSave, onClose }) {
	const [form, setForm] = useState(initial || EMPTY_ALERT);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		if (!form.title.trim() || !form.area.trim()) {
			setError('Title and area are required.');
			return;
		}
		setSaving(true);
		const result = await onSave(form);
		setSaving(false);
		if (result?.error) { setError(result.error); } else { onClose(); }
	};

	return (
		<div className="ac-modal-overlay" role="dialog" aria-modal="true">
			<div className="ac-modal">
				<div className="ac-modal-head">
					<h2>{initial ? 'Edit Alert' : 'Create Alert'}</h2>
					<button type="button" className="ac-modal-close" onClick={onClose} aria-label="Close">&times;</button>
				</div>
				{error && <div className="ac-modal-error">{error}</div>}
				<form onSubmit={handleSubmit} className="ac-modal-form">
					<label>Title *
						<input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} required />
					</label>
					<label>Severity
						<select value={form.level} onChange={(e) => set('level', e.target.value)}>
							<option value="high">High</option>
							<option value="medium">Medium</option>
							<option value="low">Low</option>
						</select>
					</label>
					<label>Affected Area *
						<input type="text" value={form.area} onChange={(e) => set('area', e.target.value)} required />
					</label>
					<label>Description
						<textarea rows="3" value={form.description} onChange={(e) => set('description', e.target.value)} />
					</label>
					<div className="ac-modal-actions">
						<button type="button" className="btn-inline" onClick={onClose} disabled={saving}>Cancel</button>
						<button type="submit" className="btn-inline primary" disabled={saving}>
							{saving ? 'Saving…' : 'Save Alert'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function AdminAlertsPage() {
	const [alerts, setAlerts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [modal, setModal] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const fetchAlerts = useCallback(async () => {
		setLoading(true);
		const { data, error: err } = await supabase
			.from('alerts')
			.select('*')
			.order('created_at', { ascending: false });
		if (err) setError(err.message);
		else setAlerts(data || []);
		setLoading(false);
	}, []);

	useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

	const handleSave = async (form) => {
		if (modal?.mode === 'add') {
			const { error: err } = await supabase.from('alerts').insert([form]);
			if (err) return { error: err.message };
		} else {
			const { error: err } = await supabase.from('alerts').update(form).eq('id', modal.alert.id);
			if (err) return { error: err.message };
		}
		await fetchAlerts();
		return {};
	};

	const handleDelete = async () => {
		setDeleting(true);
		const { error: err } = await supabase.from('alerts').delete().eq('id', deleteTarget.id);
		if (err) setError(err.message);
		else await fetchAlerts();
		setDeleting(false);
		setDeleteTarget(null);
	};

	return (
		<section className="app-page">
			<div className="app-shell">
				<div className="page-hero">
					<h1>Manage Alerts</h1>
					<p>Create targeted warnings, tune severity levels, and publish verified updates to residents and responders.</p>
					<div className="hero-meta">
						<span className="hero-pill">Broadcast Console</span>
						<span className="hero-pill">Multi-Channel Delivery</span>
					</div>
				</div>

				<div className="app-page-head">
					<span className="page-chip">Advisory Management</span>
					<button type="button" className="btn-inline primary" onClick={() => setModal({ mode: 'add' })}>+ Create Alert</button>
				</div>

				{error && <p style={{ color: 'var(--color-danger, red)', marginBottom: '0.75rem' }}>{error}</p>}
				{loading && <p>Loading alerts…</p>}

				{!loading && (
					<div className="soft-grid">
						{alerts.length === 0 ? (
							<p>No alerts found. Create one above.</p>
						) : (
							alerts.map((alert) => (
								<div key={alert.id} className="soft-card">
									<h3>{alert.title}</h3>
									<p><strong>Severity:</strong> <span className={`status-pill ${alert.level}`}>{alert.level}</span></p>
									<p><strong>Area:</strong> {alert.area}</p>
									{alert.description && <p>{alert.description}</p>}
									<div className="action-row">
										<button type="button" className="btn-inline" onClick={() => setModal({ mode: 'edit', alert })}>Edit</button>
										<button type="button" className="btn-inline danger" onClick={() => setDeleteTarget(alert)}>Delete</button>
									</div>
								</div>
							))
						)}
					</div>
				)}

				{modal && (
					<AlertModal
						initial={modal.mode === 'edit' ? modal.alert : null}
						onSave={handleSave}
						onClose={() => setModal(null)}
					/>
				)}

				{deleteTarget && (
					<div className="ac-modal-overlay" role="dialog" aria-modal="true">
						<div className="ac-modal">
							<div className="ac-modal-head">
								<h2>Delete Alert</h2>
								<button type="button" className="ac-modal-close" onClick={() => setDeleteTarget(null)} aria-label="Close">&times;</button>
							</div>
							<p>Are you sure you want to delete <strong>{deleteTarget.title}</strong>?</p>
							<div className="ac-modal-actions">
								<button type="button" className="btn-inline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
								<button type="button" className="btn-inline danger" onClick={handleDelete} disabled={deleting}>
									{deleting ? 'Deleting…' : 'Delete'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}

export default AdminAlertsPage;

