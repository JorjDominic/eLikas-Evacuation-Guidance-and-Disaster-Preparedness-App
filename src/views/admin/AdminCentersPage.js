import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../config/supabase';
import '../../styles/shared/sentinel.css';
import '../../styles/admin/AdminCentersPage.css';

const FACILITY_OPTIONS = [
  'Restrooms', 'Generator', 'Medical Bay', 'Kitchen', 'Potable Water',
  'Cots / Sleeping Areas', 'Wi-Fi', 'Wheelchair Access', 'Storage', 'Security'
];

const EMPTY_FORM = {
  name: '',
  municipality: '',
  barangay: '',
  address: '',
  latitude: '',
  longitude: '',
  capacity: '',
  current_occupancy: '',
  status: 'open',
  facilities: [],
  contact_person: '',
  contact_number: ''
};

function CenterModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleFacility = (facility) => {
    setForm((f) => ({
      ...f,
      facilities: f.facilities.includes(facility)
        ? f.facilities.filter((x) => x !== facility)
        : [...f.facilities, facility]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.municipality.trim() || !form.capacity) {
      setError('Name, municipality and capacity are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      current_occupancy: Number(form.current_occupancy) || 0,
      latitude: form.latitude !== '' ? Number(form.latitude) : null,
      longitude: form.longitude !== '' ? Number(form.longitude) : null
    };
    const result = await onSave(payload);
    setSaving(false);
    if (result?.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <div className="ac-modal-overlay" role="dialog" aria-modal="true">
      <div className="ac-modal">
        <div className="ac-modal-head">
          <h2>{initial ? 'Edit Center' : 'Add Center'}</h2>
          <button type="button" className="ac-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        </div>

        {error && <div className="ac-modal-error">{error}</div>}

        <form onSubmit={handleSubmit} className="ac-modal-form">
          <fieldset>
            <legend>Basic Info</legend>
            <div className="ac-field-row">
              <label>Name *<input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
              <label>Status<select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="open">Open</option>
                <option value="full">Full</option>
                <option value="closed">Closed</option>
              </select></label>
            </div>
            <div className="ac-field-row">
              <label>Municipality *<input type="text" value={form.municipality} onChange={(e) => set('municipality', e.target.value)} required /></label>
              <label>Barangay<input type="text" value={form.barangay} onChange={(e) => set('barangay', e.target.value)} /></label>
            </div>
            <label>Address<input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} /></label>
          </fieldset>

          <fieldset>
            <legend>Capacity</legend>
            <div className="ac-field-row">
              <label>Total Capacity *<input type="number" min="0" value={form.capacity} onChange={(e) => set('capacity', e.target.value)} required /></label>
              <label>Current Occupancy<input type="number" min="0" value={form.current_occupancy} onChange={(e) => set('current_occupancy', e.target.value)} /></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Location Coordinates</legend>
            <div className="ac-field-row">
              <label>Latitude<input type="number" step="any" value={form.latitude} onChange={(e) => set('latitude', e.target.value)} placeholder="e.g. 14.8527" /></label>
              <label>Longitude<input type="number" step="any" value={form.longitude} onChange={(e) => set('longitude', e.target.value)} placeholder="e.g. 120.8164" /></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Facilities</legend>
            <div className="ac-facilities-grid">
              {FACILITY_OPTIONS.map((f) => (
                <label key={f} className="ac-facility-check">
                  <input
                    type="checkbox"
                    checked={form.facilities.includes(f)}
                    onChange={() => toggleFacility(f)}
                  />
                  {f}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Contact</legend>
            <div className="ac-field-row">
              <label>Contact Person<input type="text" value={form.contact_person} onChange={(e) => set('contact_person', e.target.value)} /></label>
              <label>Contact Number<input type="text" value={form.contact_number} onChange={(e) => set('contact_number', e.target.value)} /></label>
            </div>
          </fieldset>

          <div className="ac-modal-actions">
            <button type="button" className="btn-inline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn-inline primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Center'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminCentersPage() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', center }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCenters = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('evacuation_centers')
      .select('*')
      .order('municipality', { ascending: true });
    if (err) setError(err.message);
    else setCenters(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCenters(); }, [fetchCenters]);

  const handleSave = async (payload) => {
    if (modal.mode === 'add') {
      const { error: err } = await supabase.from('evacuation_centers').insert([payload]);
      if (err) return { error: err.message };
    } else {
      const { error: err } = await supabase
        .from('evacuation_centers')
        .update(payload)
        .eq('id', modal.center.id);
      if (err) return { error: err.message };
    }
    await fetchCenters();
    return {};
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error: err } = await supabase
      .from('evacuation_centers')
      .delete()
      .eq('id', deleteTarget.id);
    if (err) setError(err.message);
    else await fetchCenters();
    setDeleting(false);
    setDeleteTarget(null);
  };

  const statusClass = (s) => ({ open: 'open', full: 'warning', closed: 'closed' }[s] || 'open');

  return (
    <section className="app-page">
      <div className="app-shell">
        <div className="page-hero">
          <h1>Manage Centers</h1>
          <p>Keep shelter profiles accurate, publish occupancy changes, and mark operational constraints in real time.</p>
          <div className="hero-meta">
            <span className="hero-pill">Shelter Operations Desk</span>
          </div>
        </div>

        <div className="app-page-head">
          <span className="page-chip">Center Administration</span>
          <button type="button" className="btn-inline primary" onClick={() => setModal({ mode: 'add' })}>
            + Add Center
          </button>
        </div>

        {error && <div className="ac-page-error">{error}</div>}

        <div className="table-shell card">
          {loading ? (
            <p className="ac-loading">Loading centers…</p>
          ) : centers.length === 0 ? (
            <p className="ac-loading">No centers yet. Add one to get started.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Municipality</th>
                  <th>Occupancy</th>
                  <th>Facilities</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {centers.map((center) => (
                  <tr key={center.id}>
                    <td>{center.name}</td>
                    <td>{center.barangay ? `${center.barangay}, ${center.municipality}` : center.municipality}</td>
                    <td>{center.current_occupancy} / {center.capacity}</td>
                    <td className="ac-facilities-cell">
                      {center.facilities?.length
                        ? center.facilities.slice(0, 3).join(', ') + (center.facilities.length > 3 ? ` +${center.facilities.length - 3}` : '')
                        : <span className="ac-none">—</span>}
                    </td>
                    <td><span className={`status-pill ${statusClass(center.status)}`}>{center.status}</span></td>
                    <td className="ac-action-cell">
                      <button type="button" className="btn-inline" onClick={() => setModal({ mode: 'edit', center })}>Edit</button>
                      <button type="button" className="btn-inline danger" onClick={() => setDeleteTarget(center)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <CenterModal
          initial={modal.mode === 'edit' ? { ...modal.center, latitude: modal.center.latitude ?? '', longitude: modal.center.longitude ?? '' } : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <div className="ac-modal-overlay" role="dialog" aria-modal="true">
          <div className="ac-modal ac-confirm">
            <h2>Delete Center?</h2>
            <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
            <div className="ac-modal-actions">
              <button type="button" className="btn-inline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button type="button" className="btn-inline danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminCentersPage;

