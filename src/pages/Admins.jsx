import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import {
  FiMenu, FiX, FiHome, FiCalendar, FiUsers, FiMapPin, FiPieChart, FiSettings,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiChevronLeft,
  FiUser, FiDollarSign, FiAlertCircle, FiCheckCircle, FiClock,
  FiGrid, FiMoreHorizontal, FiLoader, FiTrendingUp, FiActivity,
  FiShield, FiZap, FiLayers, FiToggleLeft, FiToggleRight, FiEye
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root {
    --bg: #0a0b0f;
    --surface: #12141a;
    --surface2: #1a1d26;
    --surface3: #22263a;
    --border: #2a2e42;
    --border2: #353a55;
    --accent: #6c63ff;
    --accent2: #9d5cf6;
    --accent3: #ff6584;
    --gold: #f5c842;
    --green: #22d3a0;
    --red: #ff4d6d;
    --blue: #3b82f6;
    --text: #e8eaf6;
    --text2: #9499b8;
    --text3: #5a5f7a;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 8px 32px rgba(0,0,0,0.5);
    --glow: 0 0 20px rgba(108,99,255,0.3);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
  input, select, textarea {
    background: var(--surface3) !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    border-radius: var(--radius-sm) !important;
    font-family: 'DM Sans', sans-serif !important;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  input:focus, select:focus, textarea:focus {
    outline: none !important;
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 3px rgba(108,99,255,0.15) !important;
  }
  input::placeholder { color: var(--text3) !important; }
  select option { background: var(--surface2); color: var(--text); }
  .error-field { border-color: var(--red) !important; box-shadow: 0 0 0 3px rgba(255,77,109,0.15) !important; }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: #fff;
    border: none;
    border-radius: var(--radius-sm);
    padding: 10px 22px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: var(--glow);
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(108,99,255,0.45); }
  .btn-ghost {
    background: transparent;
    color: var(--text2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 22px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--border2); color: var(--text); background: var(--surface3); }
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600;
  }
  .badge-green { background: rgba(34,211,160,0.15); color: var(--green); }
  .badge-red { background: rgba(255,77,109,0.15); color: var(--red); }
  .badge-blue { background: rgba(59,130,246,0.15); color: var(--blue); }
  .badge-gold { background: rgba(245,200,66,0.15); color: var(--gold); }
  .badge-purple { background: rgba(108,99,255,0.15); color: var(--accent); }
  .badge-gray { background: rgba(154,153,184,0.15); color: var(--text2); }
  table { width: 100%; border-collapse: collapse; }
  thead tr { border-bottom: 1px solid var(--border); }
  th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text3); font-family: 'Syne', sans-serif; }
  td { padding: 14px 16px; font-size: 14px; color: var(--text2); border-bottom: 1px solid rgba(42,46,66,0.5); vertical-align: middle; }
  tbody tr:hover { background: rgba(108,99,255,0.04); }
  tbody tr:last-child td { border-bottom: none; }
  .field-error { color: var(--red); font-size: 11px; margin-top: 4px; display: block; }
`;

/* ─────────────────────────── TOAST ─────────────────────────── */
const ToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
        borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(20px)',
        background: t.type === 'success' ? 'rgba(34,211,160,0.15)' : t.type === 'error' ? 'rgba(255,77,109,0.15)' : 'rgba(108,99,255,0.15)',
        border: `1px solid ${t.type === 'success' ? 'var(--green)' : t.type === 'error' ? 'var(--red)' : 'var(--accent)'}`,
        color: t.type === 'success' ? 'var(--green)' : t.type === 'error' ? 'var(--red)' : 'var(--accent)',
        minWidth: 280, boxShadow: 'var(--shadow)', animation: 'slideIn 0.3s ease'
      }}>
        {t.type === 'success' ? <FiCheckCircle size={16} /> : <FiAlertCircle size={16} />}
        <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{t.message}</span>
        <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}><FiX size={14} /></button>
      </div>
    ))}
  </div>
);

/* ─────────────────────────── VALIDATION HELPERS ─────────────────────────── */
const validatePark = (form) => {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Park name is required';
  else if (form.name.trim().length < 3) errors.name = 'Name must be at least 3 characters';
  if (!form.address?.trim()) errors.address = 'Address is required';
  if (!form.city?.trim()) errors.city = 'City is required';
  if (!form.type) errors.type = 'Type is required';
  if (form.pricePerHour === '' || form.pricePerHour === undefined) errors.pricePerHour = 'Price per hour is required';
  else if (isNaN(form.pricePerHour) || Number(form.pricePerHour) < 0) errors.pricePerHour = 'Price must be a positive number';
  if (form.totalSlots !== '' && (isNaN(form.totalSlots) || Number(form.totalSlots) < 0)) errors.totalSlots = 'Total slots must be a positive number';
  if (form.availableSlots !== '' && (isNaN(form.availableSlots) || Number(form.availableSlots) < 0)) errors.availableSlots = 'Available slots must be a positive number';
  if (Number(form.availableSlots) > Number(form.totalSlots)) errors.availableSlots = 'Available slots cannot exceed total slots';
  if (form.lat && (isNaN(form.lat) || Number(form.lat) < -90 || Number(form.lat) > 90)) errors.lat = 'Invalid latitude (-90 to 90)';
  if (form.lng && (isNaN(form.lng) || Number(form.lng) < -180 || Number(form.lng) > 180)) errors.lng = 'Invalid longitude (-180 to 180)';
  return errors;
};

const validateSlot = (form) => {
  const errors = {};
  if (!form.parkingId) errors.parkingId = 'Parking lot is required';
  if (!form.slotNumber?.trim()) errors.slotNumber = 'Slot number is required';
  else if (form.slotNumber.trim().length < 1) errors.slotNumber = 'Slot number cannot be empty';
  if (!form.type?.trim()) errors.type = 'Slot type is required';
  if (form.pricePerHour === '' || form.pricePerHour === undefined) errors.pricePerHour = 'Price per hour is required';
  else if (isNaN(form.pricePerHour) || Number(form.pricePerHour) < 0) errors.pricePerHour = 'Price must be a positive number';
  if (form.floor !== '' && (isNaN(form.floor) || Number(form.floor) < 1)) errors.floor = 'Floor must be at least 1';
  return errors;
};

/* ─────────────────────────── FIELD COMPONENT ─────────────────────────── */
const Field = ({ label, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne, sans-serif' }}>{label}</label>
    {children}
    {error && <span className="field-error"><FiAlertCircle size={10} style={{ marginRight: 4 }} />{error}</span>}
  </div>
);

/* ─────────────────────────── MODAL WRAPPER ─────────────────────────── */
const Modal = ({ isOpen, onClose, title, subtitle, children, width = 520 }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', width: '100%', maxWidth: width,
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)', animation: 'modalIn 0.25s ease',
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>{title}</h2>
              {subtitle && <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>{subtitle}</p>}
            </div>
            <button onClick={onClose} style={{ background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text2)', lineHeight: 0 }}><FiX size={16} /></button>
          </div>
        </div>
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

/* ─────────────────────────── PARK MODAL ─────────────────────────── */
const ParkModal = ({ isOpen, onClose, onSave, editingPark }) => {
  const defaultForm = { name: '', description: '', image: '', address: '', city: '', lat: '', lng: '', type: 'street', totalSlots: '', availableSlots: '', pricePerHour: '' };
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingPark) {
      setForm({
        name: editingPark.name || '',
        description: editingPark.description || '',
        image: editingPark.image || '',
        address: editingPark.location?.address || editingPark.address || '',
        city: editingPark.location?.city || editingPark.city || '',
        lat: editingPark.location?.lat ?? editingPark.lat ?? '',
        lng: editingPark.location?.lng ?? editingPark.lng ?? '',
        type: editingPark.type || 'street',
        totalSlots: editingPark.totalSlots ?? '',
        availableSlots: editingPark.availableSlots ?? '',
        pricePerHour: editingPark.pricePerHour ?? '',
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
  }, [editingPark, isOpen]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validatePark(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      location: {
        address: form.address.trim(),
        city: form.city.trim(),
        ...(form.lat !== '' && { lat: Number(form.lat) }),
        ...(form.lng !== '' && { lng: Number(form.lng) }),
      },
      type: form.type,
      totalSlots: form.totalSlots !== '' ? Number(form.totalSlots) : undefined,
      availableSlots: form.availableSlots !== '' ? Number(form.availableSlots) : undefined,
      pricePerHour: Number(form.pricePerHour),
    };
    await onSave(payload);
    setSaving(false);
    onClose();
  };

  const inp = (style = {}) => ({ width: '100%', padding: '10px 14px', fontSize: 14, ...style });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingPark ? 'Edit Parking Lot' : 'Add Parking Lot'} subtitle="Fill all required fields accurately" width={580}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Park Name *" error={errors.name}>
            <input style={inp()} placeholder="e.g. Central Plaza Parking" value={form.name} onChange={e => set('name', e.target.value)} className={errors.name ? 'error-field' : ''} />
          </Field>
          <Field label="Type *" error={errors.type}>
            <select style={inp()} value={form.type} onChange={e => set('type', e.target.value)} className={errors.type ? 'error-field' : ''}>
              <option value="street">Street</option>
              <option value="garage">Garage</option>
              <option value="premium">Premium</option>
              <option value="private">Private</option>
            </select>
          </Field>
        </div>
        {/* Row 2 */}
        <Field label="Description" error={errors.description}>
          <textarea style={{ ...inp(), minHeight: 72, resize: 'vertical' }} placeholder="Brief description of the parking facility..." value={form.description} onChange={e => set('description', e.target.value)} />
        </Field>
        {/* Row 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Address *" error={errors.address}>
            <input style={inp()} placeholder="e.g. 123 Main Street" value={form.address} onChange={e => set('address', e.target.value)} className={errors.address ? 'error-field' : ''} />
          </Field>
          <Field label="City *" error={errors.city}>
            <input style={inp()} placeholder="e.g. New York" value={form.city} onChange={e => set('city', e.target.value)} className={errors.city ? 'error-field' : ''} />
          </Field>
        </div>
        {/* Row 4 - Geo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Latitude" error={errors.lat}>
            <input style={inp()} type="number" placeholder="e.g. 40.7128" value={form.lat} onChange={e => set('lat', e.target.value)} className={errors.lat ? 'error-field' : ''} step="any" />
          </Field>
          <Field label="Longitude" error={errors.lng}>
            <input style={inp()} type="number" placeholder="e.g. -74.0060" value={form.lng} onChange={e => set('lng', e.target.value)} className={errors.lng ? 'error-field' : ''} step="any" />
          </Field>
        </div>
        {/* Row 5 - Slots & Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <Field label="Total Slots" error={errors.totalSlots}>
            <input style={inp()} type="number" min="0" placeholder="0" value={form.totalSlots} onChange={e => set('totalSlots', e.target.value)} className={errors.totalSlots ? 'error-field' : ''} />
          </Field>
          <Field label="Available Slots" error={errors.availableSlots}>
            <input style={inp()} type="number" min="0" placeholder="0" value={form.availableSlots} onChange={e => set('availableSlots', e.target.value)} className={errors.availableSlots ? 'error-field' : ''} />
          </Field>
          <Field label="Price / Hour ($) *" error={errors.pricePerHour}>
            <input style={inp()} type="number" min="0" step="0.01" placeholder="0.00" value={form.pricePerHour} onChange={e => set('pricePerHour', e.target.value)} className={errors.pricePerHour ? 'error-field' : ''} />
          </Field>
        </div>
        {/* Image URL */}
        <Field label="Image URL" error={errors.image}>
          <input style={inp()} type="url" placeholder="https://example.com/image.jpg" value={form.image} onChange={e => set('image', e.target.value)} className={errors.image ? 'error-field' : ''} />
        </Field>
        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 110 }}>
            {saving ? <FiLoader size={14} className="animate-spin" style={{ display: 'inline', marginRight: 6 }} /> : null}
            {saving ? 'Saving...' : (editingPark ? 'Update Park' : 'Create Park')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ─────────────────────────── SLOT MODAL ─────────────────────────── */
const SlotModal = ({ isOpen, onClose, onSave, editingSlot, parks }) => {
  const defaultForm = { parkingId: '', slotNumber: '', floor: 1, type: 'Car', isBooked: false, pricePerHour: '' };
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (editingSlot) {
      setForm({
        parkingId: editingSlot.parkingId?._id || editingSlot.parkingId || '',
        slotNumber: editingSlot.slotNumber || '',
        floor: editingSlot.floor ?? 1,
        type: editingSlot.type || 'Car',
        isBooked: editingSlot.isBooked || false,
        pricePerHour: editingSlot.pricePerHour ?? '',
      });
    } else {
      setForm({ ...defaultForm, parkingId: parks[0]?.id || parks[0]?._id || '' });
    }
    setErrors({});
  }, [editingSlot, isOpen, parks]);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validateSlot(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = {
      parkingId: form.parkingId,
      slotNumber: form.slotNumber.trim(),
      floor: Number(form.floor),
      type: form.type,
      isBooked: form.isBooked,
      pricePerHour: Number(form.pricePerHour),
    };
    await onSave(payload);
    setSaving(false);
    onClose();
  };

  const inp = (style = {}) => ({ width: '100%', padding: '10px 14px', fontSize: 14, ...style });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingSlot ? 'Edit Slot' : 'Add Slot'} subtitle="Define slot details for the parking lot">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Parking Lot *" error={errors.parkingId}>
          <select style={inp()} value={form.parkingId} onChange={e => set('parkingId', e.target.value)} className={errors.parkingId ? 'error-field' : ''}>
            <option value="">— Select Parking Lot —</option>
            {parks.map(p => <option key={p.id || p._id} value={p.id || p._id}>{p.name}</option>)}
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Slot Number *" error={errors.slotNumber}>
            <input style={inp()} placeholder="e.g. A-01, B-12" value={form.slotNumber} onChange={e => set('slotNumber', e.target.value)} className={errors.slotNumber ? 'error-field' : ''} />
          </Field>
          <Field label="Floor" error={errors.floor}>
            <input style={inp()} type="number" min="1" placeholder="1" value={form.floor} onChange={e => set('floor', e.target.value)} className={errors.floor ? 'error-field' : ''} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Slot Type *" error={errors.type}>
            <select style={inp()} value={form.type} onChange={e => set('type', e.target.value)} className={errors.type ? 'error-field' : ''}>
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
              <option value="EV">EV</option>
              <option value="Truck">Truck</option>
              <option value="Handicap">Handicap</option>
            </select>
          </Field>
          <Field label="Price / Hour ($) *" error={errors.pricePerHour}>
            <input style={inp()} type="number" min="0" step="0.01" placeholder="0.00" value={form.pricePerHour} onChange={e => set('pricePerHour', e.target.value)} className={errors.pricePerHour ? 'error-field' : ''} />
          </Field>
        </div>
        <Field label="Status">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button type="button" onClick={() => set('isBooked', !form.isBooked)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', color: form.isBooked ? 'var(--red)' : 'var(--green)', fontFamily: 'DM Sans, sans-serif', fontSize: 13 }}>
              {form.isBooked ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
              {form.isBooked ? 'Booked' : 'Available'}
            </button>
          </div>
        </Field>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ minWidth: 110 }}>
            {saving ? <FiLoader size={14} style={{ display: 'inline', marginRight: 6 }} /> : null}
            {saving ? 'Saving...' : (editingSlot ? 'Update Slot' : 'Create Slot')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

/* ─────────────────────────── USER DETAIL MODAL ─────────────────────────── */
const UserDetailModal = ({ user, bookings, onClose }) => {
  const userBookings = bookings.filter(b => (b.userId?._id || b.userId?.id) === (user._id || user.id));
  const statusBadge = s => {
    const map = { confirmed: 'badge-green', completed: 'badge-blue', pending: 'badge-gold', cancelled: 'badge-red' };
    return map[s] || 'badge-gray';
  };
  return (
    <Modal isOpen={!!user} onClose={onClose} title={user?.name} subtitle={user?.email} width={620}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Role', val: user?.role || 'user' },
            { label: 'Total Bookings', val: userBookings.length },
            { label: 'Total Spent', val: `$${userBookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0).toFixed(2)}` },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
              <p style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne, sans-serif', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{s.val}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne, sans-serif', marginBottom: 12 }}>Booking History</h3>
          {userBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text3)', fontSize: 13 }}>No bookings found for this user.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {userBookings.map(b => (
                <div key={b.id || b._id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{b.parkingId?.name || 'N/A'} — Slot {b.slotId?.slotNumber || 'N/A'}</p>
                    <p style={{ fontSize: 12, color: 'var(--text3)' }}>{b.startTime ? new Date(b.startTime).toLocaleDateString() : '—'}</p>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: 15 }}>${b.totalPrice}</span>
                    <span className={`badge ${statusBadge(b.status)}`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

/* ─────────────────────────── DELETE CONFIRM ─────────────────────────── */
const DeleteConfirm = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" width={420}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.2)', borderRadius: 'var(--radius-sm)', padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <FiAlertCircle size={20} style={{ color: 'var(--red)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{title}</p>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>{message || 'This action cannot be undone.'}</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button onClick={() => { onConfirm(); onClose(); }} style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '10px 22px', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Delete</button>
      </div>
    </div>
  </Modal>
);

/* ─────────────────────────── MAIN COMPONENT ─────────────────────────── */
const Admins = () => {
  const {
    loading, dashboardStats, bookingTrends, users, parks, slots, bookings,
    fetchDashboard, fetchUsers, fetchParks, fetchSlots, fetchBookings,
    createPark, updatePark, deletePark, createSlot, updateSlot, deleteSlot,
    toggleBlockUser, updateBooking, toasts, addToast, removeToast
  } = useAdmin();

  const [activeMenu, setActiveMenu] = useState('systems');
  const [parksSubView, setParksSubView] = useState('parking');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showParkModal, setShowParkModal] = useState(false);
  const [editingPark, setEditingPark] = useState(null);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [parkSearch, setParkSearch] = useState('');
  const [slotSearch, setSlotSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [bookingSearch, setBookingSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'park'|'slot', id, name }

  useEffect(() => {
    fetchDashboard(); fetchUsers(1, ''); fetchParks(1, ''); fetchSlots(1, ''); fetchBookings(1, '');
  }, []);

  useEffect(() => { const t = setTimeout(() => fetchParks(1, parkSearch), 300); return () => clearTimeout(t); }, [parkSearch]);
  useEffect(() => { const t = setTimeout(() => fetchSlots(1, slotSearch), 300); return () => clearTimeout(t); }, [slotSearch]);
  useEffect(() => { const t = setTimeout(() => fetchUsers(1, userSearch), 300); return () => clearTimeout(t); }, [userSearch]);
  useEffect(() => { const t = setTimeout(() => fetchBookings(1, bookingSearch), 300); return () => clearTimeout(t); }, [bookingSearch]);

  const totalRevenue = dashboardStats.totalRevenue || 0;
  const totalUsers = dashboardStats.totalUsers || 0;
  const totalBookings = dashboardStats.totalBookings || 0;
  const totalParks = dashboardStats.totalParks || 0;
  const totalSlots = dashboardStats.totalSlots || 0;

  const bookingStatusData = [
    { name: 'Active', value: bookings.data.filter(b => b.status === 'confirmed').length },
    { name: 'Completed', value: bookings.data.filter(b => b.status === 'completed').length },
    { name: 'Upcoming', value: bookings.data.filter(b => b.status === 'pending').length },
    { name: 'Cancelled', value: bookings.data.filter(b => b.status === 'cancelled').length },
  ];
  const COLORS = ['#6c63ff', '#22d3a0', '#f5c842', '#ff4d6d'];
  const monthlyRevenueData = bookingTrends.map(item => ({ name: item._id, revenue: item.revenue, bookings: item.count }));
  const runningBookings = bookings.data.filter(b => b.status === 'confirmed' && new Date(b.startTime).toDateString() === new Date().toDateString());

  const statusBadge = (s) => {
    const map = { confirmed: 'badge-green', completed: 'badge-blue', pending: 'badge-gold', cancelled: 'badge-red' };
    return map[s] || 'badge-gray';
  };
  const payBadge = (s) => ({ paid: 'badge-green', pending: 'badge-gold', failed: 'badge-red' }[s] || 'badge-gray');

  const menuItems = [
    { id: 'systems', label: 'Dashboard', icon: <FiHome /> },
    { id: 'bookings', label: 'Bookings', icon: <FiCalendar /> },
    { id: 'users', label: 'Users', icon: <FiUsers /> },
    { id: 'parks', label: 'Parks', icon: <FiMapPin />, hasDropdown: true },
    { id: 'analytics', label: 'Analytics', icon: <FiPieChart /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <FiSearch size={14} style={{ position: 'absolute', left: 12, color: 'var(--text3)', pointerEvents: 'none' }} />
      <input style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, fontSize: 13, minWidth: 220, background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)' }}
        placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );

  const Pagination = ({ page, totalPages, onPageChange }) => {
    if (!totalPages || totalPages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPageChange(p)} style={{
            width: 34, height: 34, borderRadius: 8, border: p === page ? 'none' : '1px solid var(--border)',
            background: p === page ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--surface3)',
            color: p === page ? '#fff' : 'var(--text2)', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            fontFamily: 'DM Sans, sans-serif'
          }}>{p}</button>
        ))}
      </div>
    );
  };

  const SectionHeader = ({ title, icon, action }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(108,99,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>{icon}</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>{title}</h2>
      </div>
      {action}
    </div>
  );

  const Card = ({ children, style = {} }) => (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, ...style }}>{children}</div>
  );

  /* ── SYSTEMS DASHBOARD ── */
  const SystemsDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Users', val: totalUsers, icon: <FiUsers />, color: '#3b82f6', glow: 'rgba(59,130,246,0.2)' },
          { label: 'Bookings', val: totalBookings, icon: <FiCalendar />, color: '#22d3a0', glow: 'rgba(34,211,160,0.2)' },
          { label: 'Parking Lots', val: totalParks, icon: <FiMapPin />, color: '#6c63ff', glow: 'rgba(108,99,255,0.2)' },
          { label: 'Total Slots', val: totalSlots, icon: <FiGrid />, color: '#f5c842', glow: 'rgba(245,200,66,0.2)' },
          { label: 'Revenue', val: `$${totalRevenue.toFixed(0)}`, icon: <FiDollarSign />, color: '#ff6584', glow: 'rgba(255,101,132,0.2)' },
        ].map((c, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', alignItems: 'center', gap: 14, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${c.glow}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.glow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, fontSize: 20 }}>{c.icon}</div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Syne, sans-serif', marginBottom: 4 }}>{c.label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>{c.val}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#6c63ff" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Booking Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={bookingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3}>
                {bookingStatusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif' }}><FiActivity size={14} style={{ marginRight: 8 }} />Active Today</h3>
          <span className="badge badge-green">{runningBookings.length} Running</span>
        </div>
        {runningBookings.length === 0 ? (
          <p style={{ color: 'var(--text3)', fontSize: 13, padding: '16px 0' }}>No active bookings today.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {runningBookings.map(b => (
              <div key={b.id || b._id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{b.parkingId?.name} — {b.slotId?.slotNumber}</p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>{b.userId?.name} · ${b.totalPrice}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  /* ── BOOKINGS ── */
  const BookingsManagement = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <SectionHeader title="Bookings" icon={<FiCalendar />} action={<SearchBar value={bookingSearch} onChange={setBookingSearch} placeholder="Search bookings..." />} />
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>User</th><th>Park / Slot</th><th>Duration</th><th>Amount</th><th>Booking Status</th><th>Payment</th></tr></thead>
            <tbody>
              {bookings.data.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No bookings found.</td></tr>}
              {bookings.data.map(b => (
                <tr key={b.id || b._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)' }}><FiUser size={13} /></div>
                      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{b.userId?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{b.parkingId?.name || 'N/A'}</span>
                    <span style={{ color: 'var(--text3)' }}> — {b.slotId?.slotNumber || 'N/A'}</span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {b.startTime ? new Date(b.startTime).toLocaleDateString() : '—'}
                    {b.endTime ? ` → ${new Date(b.endTime).toLocaleDateString()}` : ''}
                  </td>
                  <td><span style={{ fontWeight: 700, color: 'var(--gold)' }}>${b.totalPrice}</span></td>
                  <td>
                    <select value={b.status} onChange={e => updateBooking(b.id || b._id, e.target.value, null)}
                      style={{ padding: '6px 10px', fontSize: 12, borderRadius: 8, minWidth: 110 }}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <select value={b.paymentStatus} onChange={e => updateBooking(b.id || b._id, null, e.target.value)}
                      style={{ padding: '6px 10px', fontSize: 12, borderRadius: 8, minWidth: 100 }}>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={bookings.page} totalPages={bookings.totalPages} onPageChange={p => fetchBookings(p, bookingSearch)} />
      </Card>
    </div>
  );

  /* ── USERS ── */
  const UsersManagement = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <SectionHeader title="Users" icon={<FiUsers />} action={<SearchBar value={userSearch} onChange={setUserSearch} placeholder="Search users..." />} />
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.data.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No users found.</td></tr>}
              {users.data.map(u => (
                <tr key={u.id || u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                        {(u.name || 'U')[0].toUpperCase()}
                      </div>
                      <button onClick={() => setSelectedUser(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 600, fontSize: 14, fontFamily: 'DM Sans, sans-serif' }}>{u.name}</button>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-gray'}`}>{u.role || 'user'}</span></td>
                  <td><span className={`badge ${u.isBlocked ? 'badge-red' : 'badge-green'}`}>{u.isBlocked ? 'Blocked' : 'Active'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button onClick={() => setSelectedUser(u)} style={{ background: 'rgba(59,130,246,0.12)', border: 'none', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'var(--blue)', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}><FiEye size={13} /> View</button>
                      <button onClick={() => toggleBlockUser(u.id || u._id)}
                        style={{ background: u.isBlocked ? 'rgba(34,211,160,0.12)' : 'rgba(255,77,109,0.12)', border: 'none', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: u.isBlocked ? 'var(--green)' : 'var(--red)', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={users.page} totalPages={users.totalPages} onPageChange={p => fetchUsers(p, userSearch)} />
      </Card>
      {selectedUser && <UserDetailModal user={selectedUser} bookings={bookings.data} onClose={() => setSelectedUser(null)} />}
    </div>
  );

  /* ── PARKS ── */
  const ParksManagement = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <SectionHeader title="Parking Lots" icon={<FiMapPin />}
          action={
            <div style={{ display: 'flex', gap: 10 }}>
              <SearchBar value={parkSearch} onChange={setParkSearch} placeholder="Search parks..." />
              <button className="btn-primary" onClick={() => { setEditingPark(null); setShowParkModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px' }}>
                <FiPlus size={14} /> Add Park
              </button>
            </div>
          } />
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Name</th><th>Address</th><th>Type</th><th>Total</th><th>Available</th><th>Price/hr</th><th>Actions</th></tr></thead>
            <tbody>
              {parks.data.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No parking lots found. Create one to get started.</td></tr>}
              {parks.data.map(p => (
                <tr key={p.id || p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.image && <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text3)' }}>{p.location?.city}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ maxWidth: 180 }}><span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.location?.address || '—'}</span></td>
                  <td><span className={`badge ${p.type === 'premium' ? 'badge-gold' : p.type === 'garage' ? 'badge-blue' : p.type === 'private' ? 'badge-purple' : 'badge-gray'}`}>{p.type}</span></td>
                  <td>{p.totalSlots ?? '—'}</td>
                  <td>
                    <span style={{ color: (p.availableSlots || 0) > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{p.availableSlots ?? '—'}</span>
                  </td>
                  <td><span style={{ fontWeight: 700, color: 'var(--gold)' }}>${p.pricePerHour}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingPark(p); setShowParkModal(true); }} style={{ background: 'rgba(108,99,255,0.12)', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: 'var(--accent)' }}><FiEdit2 size={14} /></button>
                      <button onClick={() => setDeleteTarget({ type: 'park', id: p.id || p._id, name: p.name })} style={{ background: 'rgba(255,77,109,0.12)', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: 'var(--red)' }}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={parks.page} totalPages={parks.totalPages} onPageChange={p => fetchParks(p, parkSearch)} />
      </Card>
      <ParkModal isOpen={showParkModal} onClose={() => setShowParkModal(false)}
        onSave={data => editingPark ? updatePark(editingPark.id || editingPark._id, data) : createPark(data)}
        editingPark={editingPark} />
    </div>
  );

  /* ── SLOTS ── */
  const SlotsManagement = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card>
        <SectionHeader title="Slots" icon={<FiGrid />}
          action={
            <div style={{ display: 'flex', gap: 10 }}>
              <SearchBar value={slotSearch} onChange={setSlotSearch} placeholder="Search slots..." />
              <button className="btn-primary" onClick={() => { setEditingSlot(null); setShowSlotModal(true); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px' }}>
                <FiPlus size={14} /> Add Slot
              </button>
            </div>
          } />
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead><tr><th>Park</th><th>Slot</th><th>Floor</th><th>Type</th><th>Status</th><th>Price/hr</th><th>Actions</th></tr></thead>
            <tbody>
              {slots.data.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text3)' }}>No slots found.</td></tr>}
              {slots.data.map(s => (
                <tr key={s.id || s._id}>
                  <td style={{ fontWeight: 500, color: 'var(--text)' }}>{s.parkingId?.name || '—'}</td>
                  <td><span style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif', fontSize: 15 }}>{s.slotNumber}</span></td>
                  <td style={{ color: 'var(--text3)' }}>F{s.floor || 1}</td>
                  <td><span className="badge badge-blue">{s.type}</span></td>
                  <td><span className={`badge ${s.isBooked ? 'badge-red' : 'badge-green'}`}>{s.isBooked ? 'Booked' : 'Available'}</span></td>
                  <td><span style={{ fontWeight: 700, color: 'var(--gold)' }}>${s.pricePerHour}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => { setEditingSlot(s); setShowSlotModal(true); }} style={{ background: 'rgba(108,99,255,0.12)', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: 'var(--accent)' }}><FiEdit2 size={14} /></button>
                      <button onClick={() => setDeleteTarget({ type: 'slot', id: s.id || s._id, name: s.slotNumber })} style={{ background: 'rgba(255,77,109,0.12)', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: 'var(--red)' }}><FiTrash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={slots.page} totalPages={slots.totalPages} onPageChange={p => fetchSlots(p, slotSearch)} />
      </Card>
      <SlotModal isOpen={showSlotModal} onClose={() => setShowSlotModal(false)}
        onSave={data => editingSlot ? updateSlot(editingSlot.id || editingSlot._id, data) : createSlot(data)}
        editingSlot={editingSlot} parks={parks.data} />
    </div>
  );

  /* ── ANALYTICS ── */
  const AnalyticsDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {[
          { label: 'Users', val: totalUsers, icon: <FiUsers size={16} />, color: 'var(--blue)' },
          { label: 'Bookings', val: totalBookings, icon: <FiCalendar size={16} />, color: 'var(--green)' },
          { label: 'Parks', val: totalParks, icon: <FiMapPin size={16} />, color: 'var(--accent)' },
          { label: 'Slots', val: totalSlots, icon: <FiGrid size={16} />, color: 'var(--gold)' },
          { label: 'Revenue', val: `$${totalRevenue.toFixed(0)}`, icon: <FiDollarSign size={16} />, color: 'var(--accent3)' },
        ].map((c, i) => (
          <Card key={i} style={{ textAlign: 'center', padding: 18 }}>
            <div style={{ color: c.color, display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{c.icon}</div>
            <p style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>{c.val}</p>
            <p style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, fontFamily: 'Syne, sans-serif' }}>{c.label}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 20 }}>Revenue & Bookings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyRevenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} />
            <YAxis yAxisId="left" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: 'var(--accent)', r: 4 }} name="Revenue ($)" />
            <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="var(--green)" strokeWidth={2.5} dot={{ fill: 'var(--green)', r: 4 }} name="Bookings" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Bookings by Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Bar dataKey="bookings" fill="var(--accent)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Syne, sans-serif', marginBottom: 16 }}>Booking Status Split</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={bookingStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3}>
                {bookingStatusData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)' }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );

  /* ── SETTINGS ── */
  const SettingsPanel = () => (
    <Card>
      <SectionHeader title="Settings" icon={<FiSettings />} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[{ label: 'Profile Settings', sub: 'Manage name, email and password', icon: <FiUser /> },
          { label: 'Notifications', sub: 'Configure alert preferences', icon: <FiAlertCircle /> },
          { label: 'Security', sub: 'Two-factor auth and sessions', icon: <FiShield /> },
          { label: 'System', sub: 'Application-wide configuration', icon: <FiZap /> },
        ].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>{s.icon}</div>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{s.label}</p>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>{s.sub}</p>
              </div>
            </div>
            <FiChevronLeft style={{ transform: 'rotate(180deg)', color: 'var(--text3)' }} size={16} />
          </div>
        ))}
      </div>
    </Card>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'systems': return <SystemsDashboard />;
      case 'bookings': return <BookingsManagement />;
      case 'users': return <UsersManagement />;
      case 'parks': return parksSubView === 'parking' ? <ParksManagement /> : <SlotsManagement />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'settings': return <SettingsPanel />;
      default: return <SystemsDashboard />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <style>{`
        @keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes modalIn { from { transform: scale(0.96) translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
        .nav-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 11px 18px; border: none; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: var(--text2); transition: all 0.15s; border-radius: 10px; margin: 0 8px; width: calc(100% - 16px); }
        .nav-item:hover { background: var(--surface2); color: var(--text); }
        .nav-item.active { background: rgba(108,99,255,0.15); color: var(--accent); border-left: 3px solid var(--accent); }
      `}</style>
      <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>
        {/* Sidebar */}
        <div style={{
          width: sidebarOpen ? 260 : 72, background: 'var(--surface)', borderRight: '1px solid var(--border)',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 20, overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 68, flexShrink: 0 }}>
            {sidebarOpen && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontFamily: 'Syne, sans-serif', fontSize: 14 }}>P</div>
                <div>
                  <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>ParkFlow</p>
                  <p style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Console</p>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text2)', lineHeight: 0, flexShrink: 0 }}>
              {sidebarOpen ? <FiChevronLeft size={16} /> : <FiMenu size={16} />}
            </button>
          </div>
          <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
            {menuItems.map(item => (
              <div key={item.id}>
                <button
                  className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                  style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center', margin: '2px 8px', width: 'calc(100% - 16px)' }}
                  onClick={() => { setActiveMenu(item.id); if (item.id !== 'parks') setParksSubView('parking'); }}>
                  <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
                {item.id === 'parks' && activeMenu === 'parks' && sidebarOpen && (
                  <div style={{ marginLeft: 38, marginTop: 4, marginBottom: 6 }}>
                    {['parking', 'slots'].map(sv => (
                      <button key={sv} onClick={() => setParksSubView(sv)}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '7px 14px', background: parksSubView === sv ? 'rgba(108,99,255,0.12)' : 'none', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: parksSubView === sv ? 'var(--accent)' : 'var(--text3)', fontFamily: 'DM Sans, sans-serif', fontWeight: parksSubView === sv ? 600 : 400, transition: 'all 0.15s' }}>
                        {sv === 'parking' ? '🅿 Parking Lots' : '📍 Slots'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          {sidebarOpen && (
            <div style={{ padding: 16, borderTop: '1px solid var(--border)', background: 'var(--surface2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>A</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Admin</p>
                  <p style={{ fontSize: 11, color: 'var(--text3)' }}>Super Admin</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--text3)', fontSize: 13 }}>Loading dashboard...</p>
              </div>
            ) : renderContent()}
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      <DeleteConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === 'park' ? 'Parking Lot' : 'Slot'}: ${deleteTarget?.name}`}
        message="This will permanently remove the record and all associated data."
        onConfirm={() => {
          if (deleteTarget?.type === 'park') deletePark(deleteTarget.id);
          else deleteSlot(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Admins;