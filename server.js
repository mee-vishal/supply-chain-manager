/**
 * ChainFlow — Supply Chain Intelligence Platform
 * Backend API Server  |  Node.js + Express  |  JSON file persistence
 *
 * Start:  node server.js
 * Dev:    node --watch server.js
 *
 * API base: http://localhost:3000/api
 */

const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'db.json');

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve the connected frontend (index.html must be in the same folder)
app.use(express.static(__dirname));

// ─── JSON "database" helpers ───────────────────────────────────────────────
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB, 'utf8'));
  } catch {
    const seed = buildSeed();
    writeDB(seed);
    return seed;
  }
}

function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// ─── Seed data ─────────────────────────────────────────────────────────────
function buildSeed() {
  return {
    orders: [
      { id:'PO-2024-0892', supplier:'Omega Electronics',  cat:'Electrical',   items:3,  value:240000, priority:'High',   status:'Draft',      created:'2024-05-10', eta:'2024-05-24' },
      { id:'PO-2024-0891', supplier:'PrintPack Ltd.',     cat:'Packaging',    items:12, value:85000,  priority:'Low',    status:'Pending',    created:'2024-05-09', eta:'2024-05-18' },
      { id:'PO-2024-0890', supplier:'SteelForge Co.',     cat:'Raw Material', items:8,  value:610000, priority:'High',   status:'Pending',    created:'2024-05-09', eta:'2024-05-20' },
      { id:'PO-2024-0889', supplier:'Apex Parts',         cat:'Components',   items:5,  value:920000, priority:'Urgent', status:'Pending',    created:'2024-05-08', eta:'2024-05-12' },
      { id:'PO-2024-0888', supplier:'MaintPro',           cat:'MRO',          items:6,  value:110000, priority:'Low',    status:'Pending',    created:'2024-05-08', eta:'2024-05-16' },
      { id:'PO-2024-0887', supplier:'ChemSource',         cat:'Chemicals',    items:4,  value:370000, priority:'Med',    status:'Approved',   created:'2024-05-07', eta:'2024-05-19' },
      { id:'PO-2024-0886', supplier:'TechMach India',     cat:'Machinery',    items:2,  value:1800000,priority:'Med',    status:'Approved',   created:'2024-05-07', eta:'2024-05-25' },
      { id:'PO-2024-0880', supplier:'Apex Parts',         cat:'Bearings',     items:4,  value:450000, priority:'High',   status:'In Transit', created:'2024-04-28', eta:'2024-05-14' },
      { id:'PO-2024-0879', supplier:'Sigma Electronics',  cat:'Electronics',  items:7,  value:780000, priority:'High',   status:'Delayed',    created:'2024-04-27', eta:'2024-05-16' },
      { id:'PO-2024-0878', supplier:'PlastiForm',         cat:'Plastics',     items:3,  value:220000, priority:'Low',    status:'In Transit', created:'2024-04-26', eta:'2024-05-13' },
      { id:'PO-2024-0877', supplier:'Omega Electronics',  cat:'Electrical',   items:5,  value:310000, priority:'Med',    status:'Delivered',  created:'2024-04-20', eta:'2024-05-09' },
      { id:'PO-2024-0876', supplier:'Apex Parts',         cat:'Components',   items:10, value:860000, priority:'High',   status:'Delivered',  created:'2024-04-18', eta:'2024-05-08' },
    ],

    inventory: [
      { sku:'SKU-2241', name:'Ball Bearings Grade-B',  cat:'Mechanical',   stock:12,    reorder:50,   status:'critical', warehouse:'WH-A1', updated:'2024-05-10' },
      { sku:'SKU-1104', name:'Copper Wire 2.5mm',      cat:'Electrical',   stock:180,   reorder:200,  status:'low',      warehouse:'WH-B2', updated:'2024-05-10' },
      { sku:'SKU-0882', name:'Steel Sheet 3mm',         cat:'Raw Material', stock:540,   reorder:100,  status:'healthy',  warehouse:'WH-A1', updated:'2024-05-09' },
      { sku:'SKU-3310', name:'HDPE Granules',           cat:'Plastics',     stock:1200,  reorder:500,  status:'healthy',  warehouse:'WH-C3', updated:'2024-05-09' },
      { sku:'SKU-4421', name:'Hex Bolts M10',           cat:'Fasteners',    stock:8500,  reorder:2000, status:'healthy',  warehouse:'WH-A1', updated:'2024-05-08' },
      { sku:'SKU-2298', name:'Lubricant ISO 46',        cat:'MRO',          stock:45,    reorder:100,  status:'low',      warehouse:'WH-D4', updated:'2024-05-10' },
      { sku:'SKU-1567', name:'Polypropylene Cap',       cat:'Packaging',    stock:12000, reorder:5000, status:'healthy',  warehouse:'WH-B2', updated:'2024-05-07' },
      { sku:'SKU-5003', name:'IC Chip NE555',           cat:'Electronics',  stock:0,     reorder:500,  status:'critical', warehouse:'WH-E5', updated:'2024-05-10' },
      { sku:'SKU-3322', name:'Rubber Gasket 50mm',      cat:'Sealing',      stock:620,   reorder:300,  status:'healthy',  warehouse:'WH-A1', updated:'2024-05-08' },
      { sku:'SKU-2201', name:'PVC Pipe 25mm',           cat:'Plastics',     stock:85,    reorder:200,  status:'low',      warehouse:'WH-C3', updated:'2024-05-09' },
    ],

    suppliers: [
      { id:'SUP-001', name:'Apex Parts Ltd.',       country:'India',     countryFlag:'🇮🇳', cat:'Components',   score:96, otd:'98.2%', orders:84, valueCr:8.2,  status:'top'      },
      { id:'SUP-002', name:'Omega Electronics',     country:'India',     countryFlag:'🇮🇳', cat:'Electrical',   score:91, otd:'94.5%', orders:67, valueCr:5.8,  status:'top'      },
      { id:'SUP-003', name:'SteelForge Co.',        country:'India',     countryFlag:'🇮🇳', cat:'Raw Material', score:88, otd:'91.0%', orders:52, valueCr:12.4, status:'standard' },
      { id:'SUP-004', name:'TechComp Singapore',    country:'Singapore', countryFlag:'🇸🇬', cat:'Electronics',  score:94, otd:'96.8%', orders:28, valueCr:4.1,  status:'top'      },
      { id:'SUP-005', name:'Sigma Elect. Taiwan',   country:'Taiwan',    countryFlag:'🇹🇼', cat:'Electronics',  score:87, otd:'89.3%', orders:41, valueCr:6.7,  status:'standard' },
      { id:'SUP-006', name:'Megha Industries',      country:'India',     countryFlag:'🇮🇳', cat:'Casting',      score:72, otd:'78.5%', orders:35, valueCr:3.2,  status:'review'   },
      { id:'SUP-007', name:'ChemSource Intl.',      country:'Germany',   countryFlag:'🇩🇪', cat:'Chemicals',    score:90, otd:'93.0%', orders:22, valueCr:2.8,  status:'standard' },
      { id:'SUP-008', name:'PlastiForm Pvt.',       country:'India',     countryFlag:'🇮🇳', cat:'Plastics',     score:85, otd:'87.5%', orders:48, valueCr:2.1,  status:'standard' },
      { id:'SUP-009', name:'PrintPack Ltd.',        country:'India',     countryFlag:'🇮🇳', cat:'Packaging',    score:89, otd:'90.2%', orders:60, valueCr:1.4,  status:'standard' },
      { id:'SUP-010', name:'TechMach India',        country:'India',     countryFlag:'🇮🇳', cat:'Machinery',    score:83, otd:'85.0%', orders:12, valueCr:18.5, status:'standard' },
    ],

    logistics: [
      { id:'SH-9940', carrier:'Blue Dart', from:'Mumbai',      to:'Ludhiana',    mode:'Road', status:'On Time',  progress:82,  eta:'2024-05-12' },
      { id:'SH-9939', carrier:'FedEx',     from:'Singapore',   to:'Delhi ICD',   mode:'Air',  status:'On Time',  progress:65,  eta:'2024-05-13' },
      { id:'SH-9938', carrier:'Maersk',    from:'Shanghai',    to:'Nhava Sheva', mode:'Sea',  status:'On Time',  progress:45,  eta:'2024-05-18' },
      { id:'SH-9937', carrier:'DTDC',      from:'Chennai',     to:'Ludhiana',    mode:'Road', status:'On Time',  progress:91,  eta:'2024-05-11' },
      { id:'SH-9936', carrier:'DHL',       from:'Frankfurt',   to:'Delhi',       mode:'Air',  status:'On Time',  progress:70,  eta:'2024-05-13' },
      { id:'SH-9932', carrier:'MSC',       from:'Colombo',     to:'Nhava Sheva', mode:'Sea',  status:'Delayed',  progress:30,  eta:'2024-05-16' },
      { id:'SH-9930', carrier:'Blue Dart', from:'Bangalore',   to:'Ludhiana',    mode:'Road', status:'Delivered',progress:100, eta:'2024-05-10' },
    ],

    alerts: [
      { id:'ALT-001', severity:'critical', icon:'📦', title:'Stock-out Imminent: Ball Bearings Grade-B (SKU-2241)',          desc:'12 units remaining. Reorder point: 50 units. Lead time: 14 days. Recommended order: 200 units from Apex Parts.', action:'Reorder Now',      acknowledged:false, ts:'2024-05-10T08:22:00' },
      { id:'ALT-002', severity:'critical', icon:'⚡', title:'Supplier Payment Overdue: Megha Industries (PO-2024-0841)',     desc:'₹4.2L overdue by 12 days. Supplier has flagged shipment hold risk.',                                              action:'Process Payment',  acknowledged:false, ts:'2024-05-10T07:15:00' },
      { id:'ALT-003', severity:'critical', icon:'🚫', title:'Custom Hold: Shipment SH-9901 flagged at Delhi ICD',           desc:'Documentation discrepancy on Bill of Entry. Value: ₹12.8L. Requires legal team review.',                          action:'View Docs',        acknowledged:false, ts:'2024-05-10T06:00:00' },
      { id:'ALT-004', severity:'warning',  icon:'🚢', title:'Shipment SH-9932 delayed — Port congestion Nhava Sheva',       desc:'3-day delay. Revised ETA May 16. 14 POs affected downstream.',                                                   action:null,               acknowledged:false, ts:'2024-05-09T18:40:00' },
      { id:'ALT-005', severity:'warning',  icon:'📉', title:'Supplier Quality Score drop: Megha Industries (72/100)',       desc:'Defect rate rose from 1.2% to 3.8% this quarter. 2 consecutive below-target scores triggers review.',               action:null,               acknowledged:false, ts:'2024-05-09T15:00:00' },
      { id:'ALT-006', severity:'warning',  icon:'🌡️', title:'Temperature excursion logged — Cold chain shipment SH-9920',  desc:'Excursion of +4°C for 2h during transit. Batch quarantined. QC review required.',                                  action:null,               acknowledged:false, ts:'2024-05-09T12:10:00' },
      { id:'ALT-007', severity:'warning',  icon:'💰', title:'Budget variance: Electrical category over-spent by 8.4%',     desc:'₹38.4L spent vs ₹35.4L budget. Driven by copper price surge.',                                                    action:null,               acknowledged:false, ts:'2024-05-09T10:30:00' },
      { id:'ALT-008', severity:'info',     icon:'✅', title:'New supplier onboarded: TechComp Singapore',                  desc:'Approved for electronics category. Credit limit: ₹50L. First PO can be raised.',                                    action:null,               acknowledged:false, ts:'2024-05-08T09:00:00' },
      { id:'ALT-009', severity:'info',     icon:'🏆', title:'Apex Parts achieves 100% OTIF for Q1 2024',                   desc:'Eligible for preferred supplier tier upgrade and additional 1.5% discount negotiation.',                             action:null,               acknowledged:false, ts:'2024-05-08T08:00:00' },
    ],

    analytics: {
      kpis: {
        totalSpendCr: 42.8,
        fillRate:     94.7,
        avgLeadDays:  8.4,
        invTurnover:  3.2,
        otifRate:     91.3,
        costSavingsCr:1.24,
      },
      monthlyOrders:  [180,210,195,230,248,260,242,280,264,290,276,284],
      monthlyRevenue: [2.8,3.2,3.0,3.6,3.9,4.1,3.7,4.4,4.0,4.6,4.3,4.2],
      monthlySpend:   [2.8,3.2,3.0,3.6,3.9,4.1,3.7,4.4,4.0,4.6,4.3,4.2],
      months: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
      donut: { delivered:42, inTransit:28, processing:18, delayed:12 },
      categorySpend: {
        labels: ['Raw Material','Electrical','Components','Chemicals','Packaging','MRO','Machinery'],
        data:   [28,20,18,12,8,6,8],
      },
      leadTimeBySupplier: {
        labels: ['Apex Parts','Omega Elec.','SteelForge','ChemSource','PlastiForm','Megha Ind.','TechMach','PrintPack'],
        data:   [7,5,12,18,8,14,22,6],
      },
    },

    settings: {
      profile: { firstName:'Rahul', lastName:'Kapoor', email:'rahul.kapoor@chainflow.in', role:'Supply Chain Manager', phone:'+91 98765 43210' },
      org:     { companyName:'Kapoor Manufacturing Pvt. Ltd.', gst:'03AAGCK2847G1Z5', industry:'Manufacturing', employees:'1,200', address:'Industrial Area Phase-II, Ludhiana, Punjab 141003' },
      notifications: {
        criticalStock:true, shipmentDelays:true, poApprovals:true,
        supplierScoreChanges:false, weeklySummary:true, budgetVariance:false,
      },
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════════════
function fmtInr(paise) {
  if (paise >= 10000000) return `₹${(paise/10000000).toFixed(1)}Cr`;
  if (paise >= 100000)   return `₹${(paise/100000).toFixed(1)}L`;
  if (paise >= 1000)     return `₹${(paise/1000).toFixed(0)}K`;
  return `₹${paise.toLocaleString('en-IN')}`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

// ═══════════════════════════════════════════════════════════════════════════
//  DASHBOARD  GET /api/dashboard
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/dashboard', (req, res) => {
  const db    = readDB();
  const { orders, inventory, logistics } = db;

  const totalOrders   = orders.length;
  const pending       = orders.filter(o => ['Pending','Draft'].includes(o.status)).length;
  const totalValue    = orders.reduce((s,o) => s + o.value, 0);
  const delayed       = orders.filter(o => o.status === 'Delayed').length;
  const activeShip    = logistics.filter(s => s.status !== 'Delivered').length;
  const criticalStock = inventory.filter(i => i.status === 'critical').length;
  const lowStock      = inventory.filter(i => i.status === 'low').length;

  res.json({
    metrics: {
      totalOrders,
      pendingApprovals: pending,
      totalValueCr:     (totalValue / 10000000).toFixed(1),
      activeShipments:  activeShip,
      delayedOrders:    delayed,
      criticalStock,
      lowStock,
    },
    recentOrders: orders.slice(0, 8).map(o => ({
      ...o,
      valueFormatted: fmtInr(o.value),
      createdFormatted: fmtDate(o.created),
      etaFormatted: fmtDate(o.eta),
    })),
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  ORDERS
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/orders?status=Pending&supplier=Apex&q=search
app.get('/api/orders', (req, res) => {
  let data = readDB().orders;
  const { status, supplier, q } = req.query;
  if (status)   data = data.filter(o => o.status === status);
  if (supplier) data = data.filter(o => o.supplier.toLowerCase().includes(supplier.toLowerCase()));
  if (q)        data = data.filter(o => JSON.stringify(o).toLowerCase().includes(q.toLowerCase()));
  res.json(data.map(o => ({
    ...o,
    valueFormatted:   fmtInr(o.value),
    createdFormatted: fmtDate(o.created),
    etaFormatted:     fmtDate(o.eta),
  })));
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const db = readDB();
  const o  = db.orders.find(o => o.id === req.params.id);
  if (!o) return res.status(404).json({ error: 'Order not found' });
  res.json({ ...o, valueFormatted: fmtInr(o.value), etaFormatted: fmtDate(o.eta) });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const { supplier, cat, items, value, priority, eta } = req.body;
  if (!supplier || !cat || !items || !value) {
    return res.status(400).json({ error: 'supplier, cat, items, value are required' });
  }
  const year    = new Date().getFullYear();
  const lastNum = db.orders.reduce((max, o) => {
    const n = parseInt(o.id.split('-')[2], 10);
    return n > max ? n : max;
  }, 0);
  const newOrder = {
    id:       `PO-${year}-${String(lastNum + 1).padStart(4, '0')}`,
    supplier, cat,
    items:    Number(items),
    value:    Number(value),
    priority: priority || 'Med',
    status:   'Draft',
    created:  new Date().toISOString().slice(0, 10),
    eta:      eta || new Date(Date.now() + 14*86400000).toISOString().slice(0, 10),
  };
  db.orders.unshift(newOrder);
  writeDB(db);
  res.status(201).json({ ...newOrder, valueFormatted: fmtInr(newOrder.value), etaFormatted: fmtDate(newOrder.eta) });
});

// PUT /api/orders/:id
app.put('/api/orders/:id', (req, res) => {
  const db  = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  const allowed = ['supplier','cat','items','value','priority','status','eta'];
  allowed.forEach(k => { if (req.body[k] !== undefined) db.orders[idx][k] = req.body[k]; });
  writeDB(db);
  const o = db.orders[idx];
  res.json({ ...o, valueFormatted: fmtInr(o.value), etaFormatted: fmtDate(o.eta) });
});

// DELETE /api/orders/:id
app.delete('/api/orders/:id', (req, res) => {
  const db  = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  const [removed] = db.orders.splice(idx, 1);
  writeDB(db);
  res.json({ deleted: true, id: removed.id });
});

// ═══════════════════════════════════════════════════════════════════════════
//  INVENTORY
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/inventory?status=critical|low|healthy&cat=Electrical&q=
app.get('/api/inventory', (req, res) => {
  let data = readDB().inventory;
  const { status, cat, q } = req.query;
  if (status && status !== 'all') data = data.filter(i => i.status === status);
  if (cat)    data = data.filter(i => i.cat.toLowerCase().includes(cat.toLowerCase()));
  if (q)      data = data.filter(i => JSON.stringify(i).toLowerCase().includes(q.toLowerCase()));
  res.json(data);
});

// GET /api/inventory/summary
app.get('/api/inventory/summary', (req, res) => {
  const inv = readDB().inventory;
  res.json({
    total:    inv.length,
    healthy:  inv.filter(i => i.status === 'healthy').length,
    low:      inv.filter(i => i.status === 'low').length,
    critical: inv.filter(i => i.status === 'critical').length,
  });
});

// GET /api/inventory/:sku
app.get('/api/inventory/:sku', (req, res) => {
  const item = readDB().inventory.find(i => i.sku === req.params.sku);
  if (!item) return res.status(404).json({ error: 'SKU not found' });
  res.json(item);
});

// POST /api/inventory
app.post('/api/inventory', (req, res) => {
  const db = readDB();
  const { sku, name, cat, stock, reorder, warehouse } = req.body;
  if (!sku || !name || !cat) return res.status(400).json({ error: 'sku, name, cat required' });
  if (db.inventory.find(i => i.sku === sku)) return res.status(409).json({ error: 'SKU already exists' });
  const stockNum   = Number(stock) || 0;
  const reorderNum = Number(reorder) || 0;
  const status     = stockNum === 0 ? 'critical' : stockNum < reorderNum ? 'low' : 'healthy';
  const item = { sku, name, cat, stock: stockNum, reorder: reorderNum, status, warehouse: warehouse || 'WH-A1', updated: new Date().toISOString().slice(0,10) };
  db.inventory.push(item);
  writeDB(db);
  res.status(201).json(item);
});

// PUT /api/inventory/:sku
app.put('/api/inventory/:sku', (req, res) => {
  const db  = readDB();
  const idx = db.inventory.findIndex(i => i.sku === req.params.sku);
  if (idx === -1) return res.status(404).json({ error: 'SKU not found' });
  const allowed = ['name','cat','stock','reorder','warehouse'];
  allowed.forEach(k => { if (req.body[k] !== undefined) db.inventory[idx][k] = req.body[k]; });
  // Recalculate status
  const { stock, reorder } = db.inventory[idx];
  db.inventory[idx].status  = stock === 0 ? 'critical' : stock < reorder ? 'low' : 'healthy';
  db.inventory[idx].updated = new Date().toISOString().slice(0, 10);
  writeDB(db);
  res.json(db.inventory[idx]);
});

// DELETE /api/inventory/:sku
app.delete('/api/inventory/:sku', (req, res) => {
  const db  = readDB();
  const idx = db.inventory.findIndex(i => i.sku === req.params.sku);
  if (idx === -1) return res.status(404).json({ error: 'SKU not found' });
  const [removed] = db.inventory.splice(idx, 1);
  writeDB(db);
  res.json({ deleted: true, sku: removed.sku });
});

// ═══════════════════════════════════════════════════════════════════════════
//  SUPPLIERS
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/suppliers?status=top|standard|review&cat=Electronics&q=
app.get('/api/suppliers', (req, res) => {
  let data = readDB().suppliers;
  const { status, cat, q } = req.query;
  if (status) data = data.filter(s => s.status === status);
  if (cat)    data = data.filter(s => s.cat.toLowerCase().includes(cat.toLowerCase()));
  if (q)      data = data.filter(s => JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));
  res.json(data.map(s => ({ ...s, valueFormatted: `₹${s.valueCr}Cr` })));
});

// GET /api/suppliers/:id
app.get('/api/suppliers/:id', (req, res) => {
  const s = readDB().suppliers.find(s => s.id === req.params.id);
  if (!s) return res.status(404).json({ error: 'Supplier not found' });
  res.json({ ...s, valueFormatted: `₹${s.valueCr}Cr` });
});

// POST /api/suppliers
app.post('/api/suppliers', (req, res) => {
  const db = readDB();
  const { name, country, countryFlag, cat, score, otd, orders, valueCr } = req.body;
  if (!name || !country || !cat) return res.status(400).json({ error: 'name, country, cat required' });
  const lastId = db.suppliers.reduce((max, s) => {
    const n = parseInt(s.id.replace('SUP-',''), 10);
    return n > max ? n : max;
  }, 0);
  const supplier = {
    id: `SUP-${String(lastId+1).padStart(3,'0')}`,
    name, country, countryFlag: countryFlag || '',
    cat, score: Number(score)||0, otd: otd||'—',
    orders: Number(orders)||0, valueCr: Number(valueCr)||0,
    status: Number(score) >= 90 ? 'top' : Number(score) >= 80 ? 'standard' : 'review',
  };
  db.suppliers.push(supplier);
  writeDB(db);
  res.status(201).json({ ...supplier, valueFormatted: `₹${supplier.valueCr}Cr` });
});

// PUT /api/suppliers/:id
app.put('/api/suppliers/:id', (req, res) => {
  const db  = readDB();
  const idx = db.suppliers.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found' });
  const allowed = ['name','country','countryFlag','cat','score','otd','orders','valueCr','status'];
  allowed.forEach(k => { if (req.body[k] !== undefined) db.suppliers[idx][k] = req.body[k]; });
  if (req.body.score !== undefined) {
    const sc = Number(req.body.score);
    db.suppliers[idx].status = sc >= 90 ? 'top' : sc >= 80 ? 'standard' : 'review';
  }
  writeDB(db);
  const s = db.suppliers[idx];
  res.json({ ...s, valueFormatted: `₹${s.valueCr}Cr` });
});

// DELETE /api/suppliers/:id
app.delete('/api/suppliers/:id', (req, res) => {
  const db  = readDB();
  const idx = db.suppliers.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Supplier not found' });
  const [removed] = db.suppliers.splice(idx, 1);
  writeDB(db);
  res.json({ deleted: true, id: removed.id });
});

// ═══════════════════════════════════════════════════════════════════════════
//  LOGISTICS / SHIPMENTS
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/logistics?status=Delayed|On+Time|Delivered&carrier=DHL
app.get('/api/logistics', (req, res) => {
  let data = readDB().logistics;
  const { status, carrier, q } = req.query;
  if (status)  data = data.filter(s => s.status === status);
  if (carrier) data = data.filter(s => s.carrier.toLowerCase().includes(carrier.toLowerCase()));
  if (q)       data = data.filter(s => JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));
  res.json(data.map(s => ({ ...s, etaFormatted: fmtDate(s.eta) })));
});

// GET /api/logistics/summary
app.get('/api/logistics/summary', (req, res) => {
  const data = readDB().logistics;
  const active    = data.filter(s => s.status !== 'Delivered').length;
  const delayed   = data.filter(s => s.status === 'Delayed').length;
  const delivered = data.filter(s => s.status === 'Delivered').length;
  const onTime    = data.filter(s => s.status === 'On Time').length;
  const avgTransit = data.filter(s=>s.progress < 100)
    .reduce((acc, s, _, arr) => acc + s.progress / arr.length, 0).toFixed(1);
  res.json({ active, delayed, delivered, onTime, avgTransit });
});

// GET /api/logistics/:id
app.get('/api/logistics/:id', (req, res) => {
  const s = readDB().logistics.find(s => s.id === req.params.id);
  if (!s) return res.status(404).json({ error: 'Shipment not found' });
  res.json({ ...s, etaFormatted: fmtDate(s.eta) });
});

// POST /api/logistics
app.post('/api/logistics', (req, res) => {
  const db = readDB();
  const { carrier, from, to, mode, eta } = req.body;
  if (!carrier || !from || !to) return res.status(400).json({ error: 'carrier, from, to required' });
  const lastId = db.logistics.reduce((max, s) => {
    const n = parseInt(s.id.replace('SH-',''), 10);
    return n > max ? n : max;
  }, 0);
  const shipment = {
    id:       `SH-${lastId+1}`,
    carrier, from, to,
    mode:     mode || 'Road',
    status:   'On Time',
    progress: 0,
    eta:      eta || new Date(Date.now() + 7*86400000).toISOString().slice(0,10),
  };
  db.logistics.unshift(shipment);
  writeDB(db);
  res.status(201).json({ ...shipment, etaFormatted: fmtDate(shipment.eta) });
});

// PUT /api/logistics/:id  — update progress/status
app.put('/api/logistics/:id', (req, res) => {
  const db  = readDB();
  const idx = db.logistics.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Shipment not found' });
  const allowed = ['carrier','from','to','mode','status','progress','eta'];
  allowed.forEach(k => { if (req.body[k] !== undefined) db.logistics[idx][k] = req.body[k]; });
  writeDB(db);
  const s = db.logistics[idx];
  res.json({ ...s, etaFormatted: fmtDate(s.eta) });
});

// DELETE /api/logistics/:id
app.delete('/api/logistics/:id', (req, res) => {
  const db  = readDB();
  const idx = db.logistics.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Shipment not found' });
  const [removed] = db.logistics.splice(idx, 1);
  writeDB(db);
  res.json({ deleted: true, id: removed.id });
});

// ═══════════════════════════════════════════════════════════════════════════
//  ALERTS
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/alerts?severity=critical|warning|info&acknowledged=false
app.get('/api/alerts', (req, res) => {
  let data = readDB().alerts;
  const { severity, acknowledged } = req.query;
  if (severity)     data = data.filter(a => a.severity === severity);
  if (acknowledged === 'false') data = data.filter(a => !a.acknowledged);
  if (acknowledged === 'true')  data = data.filter(a =>  a.acknowledged);
  const counts = {
    critical: readDB().alerts.filter(a=>a.severity==='critical'&&!a.acknowledged).length,
    warning:  readDB().alerts.filter(a=>a.severity==='warning' &&!a.acknowledged).length,
    info:     readDB().alerts.filter(a=>a.severity==='info'    &&!a.acknowledged).length,
  };
  res.json({ alerts: data, counts });
});

// PUT /api/alerts/:id/acknowledge
app.put('/api/alerts/:id/acknowledge', (req, res) => {
  const db  = readDB();
  const idx = db.alerts.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Alert not found' });
  db.alerts[idx].acknowledged = true;
  writeDB(db);
  res.json(db.alerts[idx]);
});

// PUT /api/alerts/acknowledge-all
app.put('/api/alerts/acknowledge-all', (req, res) => {
  const db = readDB();
  db.alerts.forEach(a => { a.acknowledged = true; });
  writeDB(db);
  res.json({ acknowledged: db.alerts.length });
});

// POST /api/alerts  — create custom alert
app.post('/api/alerts', (req, res) => {
  const db = readDB();
  const { severity, icon, title, desc, action } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const lastId = db.alerts.reduce((max, a) => {
    const n = parseInt(a.id.replace('ALT-',''), 10);
    return n > max ? n : max;
  }, 0);
  const alert = {
    id:           `ALT-${String(lastId+1).padStart(3,'0')}`,
    severity:     severity || 'info',
    icon:         icon     || '🔔',
    title, desc:  desc     || '',
    action:       action   || null,
    acknowledged: false,
    ts:           new Date().toISOString(),
  };
  db.alerts.unshift(alert);
  writeDB(db);
  res.status(201).json(alert);
});

// ═══════════════════════════════════════════════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/analytics', (req, res) => {
  const db = readDB();
  res.json(db.analytics);
});

// ═══════════════════════════════════════════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/settings', (req, res) => {
  res.json(readDB().settings);
});

app.put('/api/settings/profile', (req, res) => {
  const db = readDB();
  const allowed = ['firstName','lastName','email','role','phone'];
  allowed.forEach(k => { if (req.body[k] !== undefined) db.settings.profile[k] = req.body[k]; });
  writeDB(db);
  res.json(db.settings.profile);
});

app.put('/api/settings/org', (req, res) => {
  const db = readDB();
  const allowed = ['companyName','gst','industry','employees','address'];
  allowed.forEach(k => { if (req.body[k] !== undefined) db.settings.org[k] = req.body[k]; });
  writeDB(db);
  res.json(db.settings.org);
});

app.put('/api/settings/notifications', (req, res) => {
  const db = readDB();
  Object.assign(db.settings.notifications, req.body);
  writeDB(db);
  res.json(db.settings.notifications);
});

// ═══════════════════════════════════════════════════════════════════════════
//  HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════
app.get('/api/health', (req, res) => {
  res.json({ status:'ok', uptime: process.uptime().toFixed(1) + 's', ts: new Date().toISOString() });
});

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅  ChainFlow API running at  http://localhost:${PORT}`);
  console.log(`   Frontend:  http://localhost:${PORT}/index.html`);
  console.log(`   Health:    http://localhost:${PORT}/api/health\n`);
  // Ensure DB file exists on first run
  readDB();
});
