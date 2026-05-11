# ChainFlow — Backend API

Full REST backend for the **ChainFlow Supply Chain Intelligence Platform**.

## Stack
- **Node.js** v18+ with **Express 4**
- **JSON file persistence** (`db.json` — zero native dependencies)
- **CORS** enabled for local dev

## Quick Start

```bash
cd chainflow-backend
npm install        # installs express + cors
node server.js     # starts on http://localhost:3000
```

Open your browser at **https://coruscating-lolly-0b810a.netlify.app/** — the frontend (`index.html`) is
served automatically from the same folder.

For development with auto-restart on save (Node 18+):
```bash
node --watch server.js
```

---

## API Reference

### Base URL
```

```

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |

---

### Dashboard
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Summary metrics + recent 8 orders |

---

### Orders `/api/orders`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/orders` | All orders. Query: `?status=Pending&supplier=Apex&q=search` |
| GET | `/api/orders/:id` | Single order |
| POST | `/api/orders` | Create order (body: `supplier, cat, items, value, priority, eta`) |
| PUT | `/api/orders/:id` | Update order fields |
| DELETE | `/api/orders/:id` | Delete order |

---

### Inventory `/api/inventory`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/inventory` | All SKUs. Query: `?status=critical|low|healthy&cat=Electrical` |
| GET | `/api/inventory/summary` | Counts by status |
| GET | `/api/inventory/:sku` | Single SKU |
| POST | `/api/inventory` | Add SKU (body: `sku, name, cat, stock, reorder, warehouse`) |
| PUT | `/api/inventory/:sku` | Update SKU (auto-recalculates status) |
| DELETE | `/api/inventory/:sku` | Remove SKU |

---

### Suppliers `/api/suppliers`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/suppliers` | All suppliers. Query: `?status=top|standard|review&cat=Electronics` |
| GET | `/api/suppliers/:id` | Single supplier |
| POST | `/api/suppliers` | Add supplier |
| PUT | `/api/suppliers/:id` | Update supplier (score auto-updates status) |
| DELETE | `/api/suppliers/:id` | Remove supplier |

---

### Logistics `/api/logistics`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/logistics` | All shipments. Query: `?status=Delayed&carrier=DHL` |
| GET | `/api/logistics/summary` | Active / delayed / delivered counts |
| GET | `/api/logistics/:id` | Single shipment |
| POST | `/api/logistics` | Create shipment |
| PUT | `/api/logistics/:id` | Update progress/status |
| DELETE | `/api/logistics/:id` | Remove shipment |

---

### Alerts `/api/alerts`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/alerts` | All alerts + counts. Query: `?severity=critical&acknowledged=false` |
| POST | `/api/alerts` | Create alert |
| PUT | `/api/alerts/:id/acknowledge` | Acknowledge one alert |
| PUT | `/api/alerts/acknowledge-all` | Acknowledge all |

---

### Analytics
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/analytics` | KPIs, monthly trends, category breakdown, lead times |

---

### Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/settings` | All settings |
| PUT | `/api/settings/profile` | Update user profile |
| PUT | `/api/settings/org` | Update org settings |
| PUT | `/api/settings/notifications` | Update notification prefs |

---

## Example Requests

```bash
# Create a purchase order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"supplier":"Apex Parts","cat":"Components","items":5,"value":500000,"priority":"High","eta":"2024-06-01"}'

# Update inventory stock
curl -X PUT http://localhost:3000/api/inventory/SKU-2241 \
  -H "Content-Type: application/json" \
  -d '{"stock": 250}'

# Acknowledge a critical alert
curl -X PUT http://localhost:3000/api/alerts/ALT-001/acknowledge

# Filter delayed shipments
curl http://localhost:3000/api/logistics?status=Delayed
```

## Data Persistence

All data is stored in `db.json` in the project root. On first run, the file is
created automatically from seed data. You can back it up, edit it directly, or
delete it to reset to defaults.

## Project Structure

```
chainflow-backend/
├── server.js      ← Express app + all routes
├── db.json        ← Auto-generated data store (created on first run)
├── index.html     ← Connected frontend (served at /)
├── package.json
└── README.md
```
