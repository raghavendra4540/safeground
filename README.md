# SafeGround AI

> **Predict risk. Find safer ground. Plan proactive relocation.**

SafeGround AI is a GIS-based, multi-hazard disaster intelligence and proactive relocation decision-support platform. It analyzes multi-hazard red zones (floods, landslides, cyclones, heat stress), assesses candidate relocation sites and their carrying capacity, prioritizes vulnerable communities, and computes feasible, bottleneck-free relocation routes across all major regions of India.

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally or MongoDB Atlas connection URI

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment (Optional for local dev)
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Seed Pan-India multi-hazard database
```bash
npm run seed
```

### 4. Start the platform
```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hazardshield.ai` | `Demo@123` |
| **Analyst** | `analyst@hazardshield.ai` | `Demo@123` |
| **Viewer** | `viewer@hazardshield.ai` | `Demo@123` |

---

## 🌐 Pan-India Multi-Location Coverage

SafeGround AI supports **16 designated regions** with dynamic GIS map camera navigation (`flyTo`) and real-time synchronized data:

- **National View**: All India (National Multi-Hazard Overview)
- **South India**: Telangana, Kerala, Tamil Nadu, Andhra Pradesh, Karnataka
- **Himalayas & North**: Uttarakhand, Himachal Pradesh, Delhi NCR
- **East & Coastal**: Odisha, West Bengal, Assam
- **West India**: Maharashtra, Gujarat, Rajasthan
- **East & Central**: Bihar

---

## 🌟 Core Modules

| Module | Description |
| :--- | :--- |
| 🗺️ **Interactive Risk Map** | Leaflet GIS map with flood, landslide, cyclone, heat, and composite hazard polygons, dynamic color pulsing, telemetry HUD, and marker click-to-analyze. |
| 🧭 **Relocation Planner** | 4-step wizard: select settlement → set population → calibrate multi-criteria priority sliders → evaluate ranked safe sites with live distance & transit cost routes. |
| 🏘️ **Settlements Intelligence** | Filterable & sortable table of monitored settlements with hazard scores, demographics, and vulnerability breakdown. |
| 🛡️ **Safe Host Sites** | Relocation host sites with carrying capacity analysis, water security, healthcare, and infrastructure ratings. |
| 🧠 **AI Decision Intelligence** | Explainable AI risk breakdowns, site recommendations, emergency plans, and situational reports. |
| 🌀 **Disaster Simulation** | Model compound multi-hazard cascading scenarios across 4 severity tiers (Normal, Elevated, Severe, Catastrophic). |
| 📊 **Executive Reports** | Multi-hazard assessments, proactive monsoon relocation strategies, and carrying capacity bottleneck plans. |
| 🔐 **Authentication & RBAC** | JWT authentication with secure httpOnly cookies, password hashing, and role-based access control (Admin, Analyst, Viewer). |

---

## 🏗️ Architecture

```
Raw GIS Hazard & Vulnerability Data
              ↓
Deterministic Multi-Hazard Engine (risk.service.js)
              ↓
Carrying Capacity & Site Ranking Engine (capacity.service.js + site-ranking.service.js)
              ↓
Proactive Relocation Optimizer (relocation.service.js)
              ↓
Explainable LLM Intelligence Layer (ai.service.js → OpenAI or Deterministic Fallback)
              ↓
Actionable Decision-Support Dashboard & Interactive GIS Map
```

---

## 🚢 Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend)
- **Backend (Render Web Service)**:
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=https://your-app.vercel.app`
- **Frontend (Vercel)**:
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Option 2: Unified Single-Service (Render / Railway / AWS EC2 / Docker)
- Build command: `npm run build`
- Start command: `npm start`
- Auto-seeding: The server automatically seeds the Pan-India dataset on initial boot if connected to an empty MongoDB cluster.

### Option 3: Docker & Docker Compose
```bash
docker-compose up -d --build
```

---

*SafeGround AI — GIS Disaster Management & Relocation Decision Support Platform.*

