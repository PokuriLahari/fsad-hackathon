import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// ─── Seed Data ───────────────────────────────────────────────────────────────
const SEED_MEDICINES = [
  { id: 1, name: "Amoxicillin", category: "Antibiotic", price: 12.5, stock_quantity: 8, expiry_date: "2026-03-01" },
  { id: 2, name: "Metformin", category: "Diabetes", price: 5.0, stock_quantity: 120, expiry_date: "2027-06-15" },
  { id: 3, name: "Lisinopril", category: "Hypertension", price: 9.75, stock_quantity: 3, expiry_date: "2026-11-20" },
  { id: 4, name: "Atorvastatin", category: "Cholesterol", price: 15.0, stock_quantity: 60, expiry_date: "2027-01-10" },
  { id: 5, name: "Omeprazole", category: "Antacid", price: 7.25, stock_quantity: 45, expiry_date: "2026-09-05" },
  { id: 6, name: "Cetirizine", category: "Antihistamine", price: 4.5, stock_quantity: 5, expiry_date: "2025-12-31" },
  { id: 7, name: "Azithromycin", category: "Antibiotic", price: 18.0, stock_quantity: 30, expiry_date: "2026-07-22" },
  { id: 8, name: "Ibuprofen", category: "Analgesic", price: 3.0, stock_quantity: 200, expiry_date: "2028-01-01" },
  { id: 9, name: "Paracetamol", category: "Analgesic", price: 2.5, stock_quantity: 180, expiry_date: "2028-05-15" },
  { id: 10, name: "Pantoprazole", category: "Antacid", price: 8.0, stock_quantity: 7, expiry_date: "2026-04-18" },
  { id: 11, name: "Salbutamol", category: "Bronchodilator", price: 22.0, stock_quantity: 25, expiry_date: "2027-02-28" },
  { id: 12, name: "Losartan", category: "Hypertension", price: 11.0, stock_quantity: 55, expiry_date: "2027-08-09" },
];

const SEED_PRESCRIPTIONS = [
  { id: 1, patient_name: "Priya Sharma", doctor_name: "Dr. Rao", medication_ids: [1, 5], is_validated: true },
  { id: 2, patient_name: "Arjun Mehta", doctor_name: "Dr. Gupta", medication_ids: [2, 4], is_validated: false },
  { id: 3, patient_name: "Sunita Patel", doctor_name: "Dr. Reddy", medication_ids: [7], is_validated: true },
  { id: 4, patient_name: "Ravi Kumar", doctor_name: "Dr. Nair", medication_ids: [3, 12], is_validated: false },
  { id: 5, patient_name: "Deepa Iyer", doctor_name: "Dr. Menon", medication_ids: [8, 9], is_validated: true },
];

const SEED_ORDERS = [
  { id: 1, medication_id: 8, quantity: 10, total_price: 30.0, order_date: "2026-03-01" },
  { id: 2, medication_id: 2, quantity: 5, total_price: 25.0, order_date: "2026-03-05" },
  { id: 3, medication_id: 9, quantity: 20, total_price: 50.0, order_date: "2026-03-08" },
  { id: 4, medication_id: 1, quantity: 3, total_price: 37.5, order_date: "2026-03-10" },
  { id: 5, medication_id: 5, quantity: 8, total_price: 58.0, order_date: "2026-03-12" },
  { id: 6, medication_id: 8, quantity: 15, total_price: 45.0, order_date: "2026-03-15" },
  { id: 7, medication_id: 7, quantity: 4, total_price: 72.0, order_date: "2026-03-18" },
  { id: 8, medication_id: 9, quantity: 12, total_price: 30.0, order_date: "2026-03-20" },
  { id: 9, medication_id: 4, quantity: 6, total_price: 90.0, order_date: "2026-03-22" },
  { id: 10, medication_id: 11, quantity: 2, total_price: 44.0, order_date: "2026-03-25" },
];

const CATEGORIES = ["All", "Antibiotic", "Diabetes", "Hypertension", "Cholesterol", "Antacid", "Antihistamine", "Analgesic", "Bronchodilator"];

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f0f4f8;
    --surface: #ffffff;
    --surface2: #f5f7fa;
    --border: #dde3ec;
    --accent: #00a86b;
    --accent2: #0066cc;
    --accent3: #e85d20;
    --warn: #c49a00;
    --danger: #d93025;
    --text: #1a2332;
    --muted: #7a8fa8;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'DM Mono', monospace;
    --radius: 12px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 220px; flex-shrink: 0; background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 0;
    position: sticky; top: 0; height: 100vh;
  }
  .logo {
    padding: 0 20px 24px; border-bottom: 1px solid var(--border);
    font-family: var(--font-head); font-size: 18px; font-weight: 800;
    letter-spacing: -0.5px;
  }
  .logo span { color: var(--accent); }
  .nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px; cursor: pointer;
    font-size: 13.5px; font-weight: 500; color: var(--muted);
    transition: all 0.15s; border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(0,229,160,0.1); color: var(--accent); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  /* Main */
  .main { flex: 1; padding: 32px; overflow-y: auto; min-height: 100vh; }
  .page-header { margin-bottom: 28px; }
  .page-title { font-family: var(--font-head); font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .page-subtitle { color: var(--muted); font-size: 13px; margin-top: 4px; }

  /* Cards */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
  }
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px 20px;
  }
  .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-family: var(--font-mono); }
  .stat-value { font-family: var(--font-head); font-size: 30px; font-weight: 800; margin-top: 4px; }
  .stat-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* Table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  th {
    text-align: left; padding: 10px 14px; color: var(--muted);
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px;
    font-family: var(--font-mono); border-bottom: 1px solid var(--border); font-weight: 400;
  }
  td { padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  /* Badges */
  .badge {
    display: inline-block; padding: 3px 8px; border-radius: 4px;
    font-size: 11px; font-family: var(--font-mono); font-weight: 500;
  }
  .badge-green { background: rgba(0,229,160,0.12); color: var(--accent); }
  .badge-red { background: rgba(255,71,87,0.12); color: var(--danger); }
  .badge-yellow { background: rgba(255,204,0,0.12); color: var(--warn); }
  .badge-blue { background: rgba(0,132,255,0.12); color: var(--accent2); }
  .badge-gray { background: rgba(90,106,130,0.2); color: var(--muted); }

  /* Inputs */
  .toolbar { display: flex; gap: 10px; margin-bottom: 16px; align-items: center; flex-wrap: wrap; }
  input, select {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 12px; color: var(--text);
    font-family: var(--font-body); font-size: 13px; outline: none;
    transition: border-color 0.15s;
  }
  input:focus, select:focus { border-color: var(--accent); }
  input[type=text], input[type=number], input[type=date] { min-width: 180px; }
  select { cursor: pointer; }
  .search-input { min-width: 240px; flex: 1; }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 8px; font-size: 13px;
    font-weight: 500; cursor: pointer; border: none; transition: all 0.15s;
    font-family: var(--font-body); white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { filter: brightness(1.1); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: rgba(255,71,87,0.1); color: var(--danger); border: 1px solid rgba(255,71,87,0.2); }
  .btn-danger:hover { background: rgba(255,71,87,0.2); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-icon { padding: 6px 8px; }

  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; backdrop-filter: blur(4px);
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; width: 480px; max-width: 95vw;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.2s ease;
    max-height: 90vh; overflow-y: auto;
  }
  @keyframes slideUp { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  .modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; margin-bottom: 20px; }
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); font-family: var(--font-mono); display: block; margin-bottom: 6px; }
  .form-input { width: 100%; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  /* Pagination */
  .pagination { display: flex; align-items: center; gap: 6px; margin-top: 16px; justify-content: flex-end; }
  .page-btn {
    width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 13px; cursor: pointer;
    border: 1px solid var(--border); background: var(--surface2); color: var(--text);
    font-family: var(--font-mono); transition: all 0.15s;
  }
  .page-btn:hover { border-color: var(--accent); color: var(--accent); }
  .page-btn.active { background: var(--accent); color: #000; border-color: var(--accent); }
  .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Charts */
  .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; margin-bottom: 16px; }

  /* Alert */
  .alert { padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 12px; }
  .alert-danger { background: rgba(255,71,87,0.1); border: 1px solid rgba(255,71,87,0.2); color: #ff6b7a; }
  .alert-warn { background: rgba(255,204,0,0.08); border: 1px solid rgba(255,204,0,0.2); color: var(--warn); }
  .alert-success { background: rgba(0,229,160,0.08); border: 1px solid rgba(0,229,160,0.2); color: var(--accent); }

  /* Low stock tag */
  .low { color: var(--danger); font-weight: 600; }
  .ok { color: var(--accent); }

  .section-gap { margin-bottom: 20px; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .gap-8 { gap: 8px; }
  .text-muted { color: var(--muted); font-size: 13px; }
  .text-mono { font-family: var(--font-mono); }
  .empty-state { text-align: center; padding: 40px; color: var(--muted); font-size: 14px; }

  /* Tooltip override */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: var(--surface) !important; border: 1px solid var(--border) !important;
    border-radius: 8px !important; font-size: 12px !important; font-family: var(--font-mono) !important;
    color: var(--text) !important;
  }

  @media (max-width: 900px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
    .chart-grid { grid-template-columns: 1fr; }
    .sidebar { width: 60px; }
    .nav-item span { display: none; }
    .logo { font-size: 0; padding: 0 16px 20px; }
    .logo span { font-size: 20px; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 6;
const fmt = (n) => `₹${Number(n).toFixed(2)}`;
const today = new Date().toISOString().split("T")[0];

function isExpiringSoon(date) {
  const d = new Date(date);
  const diff = (d - new Date()) / (1000 * 60 * 60 * 24);
  return diff < 60;
}

function validate(form, type) {
  if (type === "medicine") {
    if (!form.name?.trim()) return "Medicine name is required.";
    if (!form.category) return "Category is required.";
    if (!form.price || Number(form.price) <= 0) return "Price must be positive.";
    if (!form.stock_quantity || Number(form.stock_quantity) < 0) return "Stock quantity must be ≥ 0.";
    if (!form.expiry_date) return "Expiry date is required.";
    if (form.expiry_date < today) return "Expiry date cannot be in the past.";
  }
  if (type === "prescription") {
    if (!form.patient_name?.trim()) return "Patient name is required.";
    if (!form.doctor_name?.trim()) return "Doctor name is required.";
  }
  if (type === "order") {
    if (!form.medication_id) return "Select a medicine.";
    if (!form.quantity || Number(form.quantity) <= 0) return "Quantity must be positive.";
  }
  return null;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="modal-title" style={{ marginBottom: 0 }}>{title}</div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Pagination({ page, total, perPage, onChange }) {
  const pages = Math.max(1, Math.ceil(total / perPage));
  return (
    <div className="pagination">
      <button className="page-btn" disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} className={`page-btn ${page === i + 1 ? "active" : ""}`} onClick={() => onChange(i + 1)}>{i + 1}</button>
      ))}
      <button className="page-btn" disabled={page === pages} onClick={() => onChange(page + 1)}>›</button>
    </div>
  );
}

// ─── Medicines Module ─────────────────────────────────────────────────────────
function MedicinesModule({ medicines, setMedicines }) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || m.category === catFilter;
      return matchSearch && matchCat;
    });
  }, [medicines, search, catFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setForm({ name: "", category: "", price: "", stock_quantity: "", expiry_date: "" }); setError(""); setModal("add"); };
  const openEdit = (m) => { setForm({ ...m }); setError(""); setModal("edit"); };

  const handleSave = () => {
    const err = validate(form, "medicine");
    if (err) { setError(err); return; }
    if (modal === "add") {
      setMedicines((prev) => [...prev, { ...form, id: Date.now(), price: +form.price, stock_quantity: +form.stock_quantity }]);
    } else {
      setMedicines((prev) => prev.map((m) => m.id === form.id ? { ...form, price: +form.price, stock_quantity: +form.stock_quantity } : m));
    }
    setModal(null); setPage(1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this medicine?")) setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const F = (k) => (v) => setForm((f) => ({ ...f, [k]: typeof v === "object" ? v.target.value : v }));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Medicines Inventory</div>
        <div className="page-subtitle">Manage your full medicine catalog</div>
      </div>

      <div className="toolbar">
        <input className="search-input" type="text" placeholder="Search medicines…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Medicine</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7}><div className="empty-state">No medicines found.</div></td></tr>
              ) : paginated.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.name}</td>
                  <td><span className="badge badge-blue">{m.category}</span></td>
                  <td className="text-mono">{fmt(m.price)}</td>
                  <td className={m.stock_quantity < 10 ? "low text-mono" : "ok text-mono"}>{m.stock_quantity}</td>
                  <td className="text-mono" style={{ color: isExpiringSoon(m.expiry_date) ? "var(--warn)" : "inherit" }}>{m.expiry_date}</td>
                  <td>
                    {m.stock_quantity === 0
                      ? <span className="badge badge-red">Out of Stock</span>
                      : m.stock_quantity < 10
                        ? <span className="badge badge-yellow">Low Stock</span>
                        : <span className="badge badge-green">In Stock</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PAGE_SIZE} onChange={setPage} />
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add Medicine" : "Edit Medicine"} onClose={() => setModal(null)}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label className="form-label">Medicine Name</label>
            <input className="form-input" type="text" value={form.name} onChange={F("name")} placeholder="e.g. Amoxicillin" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={F("category")}>
                <option value="">Select…</option>
                {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" value={form.price} onChange={F("price")} placeholder="0.00" min="0" step="0.01" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input className="form-input" type="number" value={form.stock_quantity} onChange={F("stock_quantity")} placeholder="0" min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input className="form-input" type="date" value={form.expiry_date} onChange={F("expiry_date")} min={today} />
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Prescriptions Module ─────────────────────────────────────────────────────
function PrescriptionsModule({ prescriptions, setPrescriptions, medicines }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ patient_name: "", doctor_name: "", medication_ids: [], is_validated: false });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const paginated = prescriptions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = () => {
    const err = validate(form, "prescription");
    if (err) { setError(err); return; }
    setPrescriptions((prev) => [...prev, { ...form, id: Date.now() }]);
    setModal(false);
    setForm({ patient_name: "", doctor_name: "", medication_ids: [], is_validated: false });
  };

  const toggleValidate = (id) => {
    setPrescriptions((prev) => prev.map((p) => p.id === id ? { ...p, is_validated: !p.is_validated } : p));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this prescription?")) setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleMed = (id) => {
    setForm((f) => ({
      ...f,
      medication_ids: f.medication_ids.includes(id)
        ? f.medication_ids.filter((x) => x !== id)
        : [...f.medication_ids, id]
    }));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Prescriptions</div>
        <div className="page-subtitle">Track and validate patient prescriptions</div>
      </div>

      <div className="toolbar">
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => { setError(""); setModal(true); }}>+ New Prescription</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Medicines</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {paginated.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.patient_name}</td>
                  <td className="text-muted">{p.doctor_name}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {p.medication_ids.map((mid) => {
                        const m = medicines.find((x) => x.id === mid);
                        return m ? <span key={mid} className="badge badge-blue">{m.name}</span> : null;
                      })}
                    </div>
                  </td>
                  <td>
                    {p.is_validated
                      ? <span className="badge badge-green">Validated</span>
                      : <span className="badge badge-yellow">Pending</span>}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => toggleValidate(p.id)}>
                        {p.is_validated ? "Invalidate" : "Validate"}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={prescriptions.length} perPage={PAGE_SIZE} onChange={setPage} />
      </div>

      {modal && (
        <Modal title="New Prescription" onClose={() => setModal(false)}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label className="form-label">Patient Name</label>
            <input className="form-input" type="text" value={form.patient_name} onChange={(e) => setForm((f) => ({ ...f, patient_name: e.target.value }))} placeholder="Full name" />
          </div>
          <div className="form-group">
            <label className="form-label">Doctor Name</label>
            <input className="form-input" type="text" value={form.doctor_name} onChange={(e) => setForm((f) => ({ ...f, doctor_name: e.target.value }))} placeholder="Dr. …" />
          </div>
          <div className="form-group">
            <label className="form-label">Medicines Prescribed</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {medicines.map((m) => (
                <button key={m.id} className={`btn btn-sm ${form.medication_ids.includes(m.id) ? "btn-primary" : "btn-secondary"}`} onClick={() => toggleMed(m.id)}>{m.name}</button>
              ))}
            </div>
          </div>
          <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="validated" checked={form.is_validated} onChange={(e) => setForm((f) => ({ ...f, is_validated: e.target.checked }))} style={{ width: 16, height: 16 }} />
            <label htmlFor="validated" style={{ fontSize: 13, cursor: "pointer" }}>Mark as Validated</label>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Orders Module ────────────────────────────────────────────────────────────
function OrdersModule({ orders, setOrders, medicines, setMedicines }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ medication_id: "", quantity: "" });
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = () => {
    const err = validate(form, "order");
    if (err) { setError(err); return; }
    const med = medicines.find((m) => m.id === Number(form.medication_id));
    if (!med) { setError("Medicine not found."); return; }
    if (Number(form.quantity) > med.stock_quantity) {
      setError(`Insufficient stock. Only ${med.stock_quantity} units available.`);
      return;
    }
    const total_price = med.price * Number(form.quantity);
    const newOrder = { id: Date.now(), medication_id: med.id, quantity: +form.quantity, total_price, order_date: today };
    setOrders((prev) => [newOrder, ...prev]);
    setMedicines((prev) => prev.map((m) => m.id === med.id ? { ...m, stock_quantity: m.stock_quantity - +form.quantity } : m));
    setModal(false);
    setForm({ medication_id: "", quantity: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Cancel this order?")) setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Orders</div>
        <div className="page-subtitle">Place and manage medicine orders</div>
      </div>

      <div className="toolbar">
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => { setError(""); setModal(true); }}>+ Place Order</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Medicine</th><th>Qty</th><th>Total</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {paginated.length === 0
                ? <tr><td colSpan={6}><div className="empty-state">No orders yet.</div></td></tr>
                : paginated.map((o, i) => {
                  const med = medicines.find((m) => m.id === o.medication_id);
                  return (
                    <tr key={o.id}>
                      <td className="text-mono text-muted">{(page - 1) * PAGE_SIZE + i + 1}</td>
                      <td style={{ fontWeight: 600 }}>{med?.name ?? "Unknown"}</td>
                      <td className="text-mono">{o.quantity}</td>
                      <td className="text-mono" style={{ color: "var(--accent)" }}>{fmt(o.total_price)}</td>
                      <td className="text-mono text-muted">{o.order_date}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>Cancel</button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={orders.length} perPage={PAGE_SIZE} onChange={setPage} />
      </div>

      {modal && (
        <Modal title="Place New Order" onClose={() => setModal(false)}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group">
            <label className="form-label">Select Medicine</label>
            <select className="form-input" value={form.medication_id} onChange={(e) => setForm((f) => ({ ...f, medication_id: e.target.value }))}>
              <option value="">Choose medicine…</option>
              {medicines.filter((m) => m.stock_quantity > 0).map((m) => (
                <option key={m.id} value={m.id}>{m.name} — Stock: {m.stock_quantity} — {fmt(m.price)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input className="form-input" type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="0" min="1" />
          </div>
          {form.medication_id && form.quantity && (
            <div className="alert alert-success">
              Total: {fmt(medicines.find((m) => m.id === Number(form.medication_id))?.price * Number(form.quantity) || 0)}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Confirm Order</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Analytics Module ─────────────────────────────────────────────────────────
function AnalyticsModule({ medicines, orders }) {
  const lowStock = medicines.filter((m) => m.stock_quantity < 10);
  const expiringSoon = medicines.filter((m) => isExpiringSoon(m.expiry_date));
  const totalRevenue = orders.reduce((s, o) => s + o.total_price, 0);

  const topSelling = useMemo(() => {
    const map = {};
    orders.forEach((o) => { map[o.medication_id] = (map[o.medication_id] || 0) + o.quantity; });
    return Object.entries(map)
      .map(([id, qty]) => ({ name: medicines.find((m) => m.id === Number(id))?.name ?? "Unknown", qty }))
      .sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [orders, medicines]);

  const categoryStock = useMemo(() => {
    const map = {};
    medicines.forEach((m) => { map[m.category] = (map[m.category] || 0) + m.stock_quantity; });
    return Object.entries(map).map(([cat, stock]) => ({ cat, stock })).sort((a, b) => b.stock - a.stock);
  }, [medicines]);

  const salesByDate = useMemo(() => {
    const map = {};
    orders.forEach((o) => { map[o.order_date] = (map[o.order_date] || 0) + o.total_price; });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, revenue]) => ({ date: date.slice(5), revenue }));
  }, [orders]);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Analytics Dashboard</div>
        <div className="page-subtitle">Insights into inventory and sales performance</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value" style={{ color: "var(--accent)" }}>{fmt(totalRevenue)}</div>
          <div className="stat-sub">{orders.length} total orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Medicines</div>
          <div className="stat-value">{medicines.length}</div>
          <div className="stat-sub">across {new Set(medicines.map((m) => m.category)).size} categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>{lowStock.length}</div>
          <div className="stat-sub">below 10 units</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Expiring Soon</div>
          <div className="stat-value" style={{ color: "var(--warn)" }}>{expiringSoon.length}</div>
          <div className="stat-sub">within 60 days</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="card">
          <div className="chart-title">Top Selling Medicines (by qty)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topSelling}>
              <XAxis dataKey="name" tick={{ fill: "#7a8fa8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#7a8fa8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 12, color: "#1a2332" }} />
              <Bar dataKey="qty" fill="#00a86b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="chart-title">Revenue Over Time (₹)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={salesByDate}>
              <CartesianGrid stroke="#dde3ec" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: "#7a8fa8", fontSize: 11 }} />
              <YAxis tick={{ fill: "#7a8fa8", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 12, color: "#1a2332" }} />
              <Line type="monotone" dataKey="revenue" stroke="#0084ff" strokeWidth={2} dot={{ fill: "#0084ff", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <div className="chart-title">⚠ Low Stock Alerts</div>
          {lowStock.length === 0
            ? <div className="text-muted" style={{ fontSize: 13 }}>All items well-stocked.</div>
            : lowStock.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontWeight: 500 }}>{m.name}</span>
                <span className="text-mono" style={{ color: m.stock_quantity === 0 ? "var(--danger)" : "var(--warn)" }}>
                  {m.stock_quantity === 0 ? "OUT" : `${m.stock_quantity} left`}
                </span>
              </div>
            ))}
        </div>
        <div className="card">
          <div className="chart-title">Stock by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryStock} layout="vertical">
              <XAxis type="number" tick={{ fill: "#7a8fa8", fontSize: 11 }} />
              <YAxis dataKey="cat" type="category" tick={{ fill: "#7a8fa8", fontSize: 11 }} width={90} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #dde3ec", borderRadius: 8, fontSize: 12, color: "#1a2332" }} />
              <Bar dataKey="stock" fill="#e85d20" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "medicines", icon: "⬡", label: "Medicines" },
  { id: "prescriptions", icon: "✦", label: "Prescriptions" },
  { id: "orders", icon: "◎", label: "Orders" },
  { id: "analytics", icon: "◉", label: "Analytics" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [medicines, setMedicines] = useState(SEED_MEDICINES);
  const [prescriptions, setPrescriptions] = useState(SEED_PRESCRIPTIONS);
  const [orders, setOrders] = useState(SEED_ORDERS);

  const totalRevenue = orders.reduce((s, o) => s + o.total_price, 0);
  const lowStockCount = medicines.filter((m) => m.stock_quantity < 10).length;
  const pendingRx = prescriptions.filter((p) => !p.is_validated).length;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">Pharma<span>X</span></div>
          <nav className="nav">
            {NAV.map((n) => (
              <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>

        </aside>

        <main className="main">
          {tab === "dashboard" && (
            <div>
              <div className="page-header">
                <div className="page-title">Dashboard</div>
                <div className="page-subtitle">Welcome back — here's today's overview</div>
              </div>

              {lowStockCount > 0 && (
                <div className="alert alert-warn" style={{ marginBottom: 20 }}>
                  ⚠ {lowStockCount} medicine{lowStockCount > 1 ? "s" : ""} running low on stock — check inventory.
                </div>
              )}
              {pendingRx > 0 && (
                <div className="alert alert-danger" style={{ marginBottom: 20 }}>
                  ✦ {pendingRx} prescription{pendingRx > 1 ? "s" : ""} awaiting validation.
                </div>
              )}

              <div className="stat-grid">
                <div className="stat-card" style={{ borderTop: "2px solid var(--accent)" }}>
                  <div className="stat-label">Total Revenue</div>
                  <div className="stat-value" style={{ color: "var(--accent)" }}>{fmt(totalRevenue)}</div>
                  <div className="stat-sub">{orders.length} orders placed</div>
                </div>
                <div className="stat-card" style={{ borderTop: "2px solid var(--accent2)" }}>
                  <div className="stat-label">Medicines</div>
                  <div className="stat-value" style={{ color: "var(--accent2)" }}>{medicines.length}</div>
                  <div className="stat-sub">{medicines.filter((m) => m.stock_quantity > 0).length} in stock</div>
                </div>
                <div className="stat-card" style={{ borderTop: "2px solid var(--accent3)" }}>
                  <div className="stat-label">Prescriptions</div>
                  <div className="stat-value" style={{ color: "var(--accent3)" }}>{prescriptions.length}</div>
                  <div className="stat-sub">{pendingRx} pending validation</div>
                </div>
                <div className="stat-card" style={{ borderTop: "2px solid var(--danger)" }}>
                  <div className="stat-label">Low Stock</div>
                  <div className="stat-value" style={{ color: "var(--danger)" }}>{lowStockCount}</div>
                  <div className="stat-sub">items need restock</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="card">
                  <div className="chart-title">Recent Orders</div>
                  <table>
                    <thead>
                      <tr><th>Medicine</th><th>Qty</th><th>Total</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => {
                        const med = medicines.find((m) => m.id === o.medication_id);
                        return (
                          <tr key={o.id}>
                            <td style={{ fontWeight: 500 }}>{med?.name}</td>
                            <td className="text-mono">{o.quantity}</td>
                            <td className="text-mono" style={{ color: "var(--accent)" }}>{fmt(o.total_price)}</td>
                            <td className="text-mono text-muted">{o.order_date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setTab("orders")}>View all orders →</button>
                </div>
                <div className="card">
                  <div className="chart-title">⚠ Low Stock Items</div>
                  {medicines.filter((m) => m.stock_quantity < 10).map((m) => (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{m.category}</div>
                      </div>
                      <span className="badge" style={{ alignSelf: "center", background: m.stock_quantity === 0 ? "rgba(255,71,87,0.15)" : "rgba(255,204,0,0.1)", color: m.stock_quantity === 0 ? "var(--danger)" : "var(--warn)" }}>
                        {m.stock_quantity === 0 ? "OUT" : `${m.stock_quantity} left`}
                      </span>
                    </div>
                  ))}
                  <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setTab("medicines")}>Manage inventory →</button>
                </div>
              </div>
            </div>
          )}

          {tab === "medicines" && <MedicinesModule medicines={medicines} setMedicines={setMedicines} />}
          {tab === "prescriptions" && <PrescriptionsModule prescriptions={prescriptions} setPrescriptions={setPrescriptions} medicines={medicines} />}
          {tab === "orders" && <OrdersModule orders={orders} setOrders={setOrders} medicines={medicines} setMedicines={setMedicines} />}
          {tab === "analytics" && <AnalyticsModule medicines={medicines} orders={orders} />}
        </main>
      </div>
    </>
  );
}
