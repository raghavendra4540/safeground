import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import settlementRoutes from './routes/settlement.routes.js';
import hazardRoutes from './routes/hazard.routes.js';
import safeSiteRoutes from './routes/safeSite.routes.js';
import relocationRoutes from './routes/relocation.routes.js';
import simulationRoutes from './routes/simulation.routes.js';
import aiRoutes from './routes/ai.routes.js';
import reportRoutes from './routes/report.routes.js';
import regionRoutes from './routes/region.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for reverse proxies (Render, Vercel, Nginx, AWS ALB)
app.set('trust proxy', 1);

// Flexible CORS setup for production (supports comma-separated origins, wildcard, and cloud domains)
const allowedOrigins = (config.clientUrl || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.endsWith('.onrender.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
if (config.nodeEnv === 'development') app.use(morgan('dev'));

// Health check endpoints
const healthCheck = (req, res) => {
  res.json({
    success: true,
    status: 'SafeGround AI API running',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
};
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/safe-sites', safeSiteRoutes);
app.use('/api/relocation', relocationRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/regions', regionRoutes);

// Resolve possible paths for client build
const potentialDistPaths = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(__dirname, '../public'),
];
const clientDistPath = potentialDistPaths.find(p => fs.existsSync(p));

if (clientDistPath) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // If running as standalone backend API, provide a clean status landing page on /
  app.get('/', (req, res) => {
    // Check if client expects JSON
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({
        success: true,
        name: 'SafeGround AI Backend API',
        status: 'ONLINE',
        version: '1.0.0',
        environment: config.nodeEnv,
        endpoints: {
          health: '/health',
          apiHealth: '/api/health',
          overview: '/api/dashboard/overview?region=All+India',
          regions: '/api/regions',
          settlements: '/api/settlements',
          safeSites: '/api/safe-sites',
          hazards: '/api/hazards',
          auth: '/api/auth/me',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Return HTML status page for browser visits
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SafeGround AI — Backend API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #070d18; color: #e2e8f0; margin: 0; padding: 40px 20px; display: flex; justify-content: center; }
          .card { max-width: 640px; width: 100%; background: #0f1a2e; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
          .badge { display: inline-block; background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          h1 { margin: 0 0 8px 0; font-size: 24px; color: #ffffff; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.5; margin: 0 0 24px 0; }
          .endpoints { background: #070d18; border: 1px solid #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 24px; }
          .endpoints h3 { font-size: 13px; color: #94a3b8; text-transform: uppercase; margin: 0 0 12px 0; letter-spacing: 0.05em; }
          .endpoint-link { display: block; color: #60a5fa; text-decoration: none; font-size: 13px; font-family: monospace; padding: 6px 0; border-bottom: 1px solid #1e293b; }
          .endpoint-link:last-child { border-bottom: none; }
          .endpoint-link:hover { color: #93c5fd; text-decoration: underline; }
          .footer { font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">● API SERVER ONLINE</div>
          <h1>🛡️ SafeGround AI Backend</h1>
          <p>The disaster-management decision-support API is live and operational with Pan-India multi-hazard intelligence.</p>
          
          <div class="endpoints">
            <h3>Key API Endpoints</h3>
            <a class="endpoint-link" href="/health" target="_blank">GET /health → System Health Check</a>
            <a class="endpoint-link" href="/api/dashboard/overview?region=All+India" target="_blank">GET /api/dashboard/overview → Pan-India Disaster KPIs</a>
            <a class="endpoint-link" href="/api/regions" target="_blank">GET /api/regions → 16 Indian Hotspot Regions</a>
            <a class="endpoint-link" href="/api/settlements" target="_blank">GET /api/settlements → 82 Monitored Settlements</a>
            <a class="endpoint-link" href="/api/safe-sites" target="_blank">GET /api/safe-sites → 35 Safe Host Sites</a>
            <a class="endpoint-link" href="/api/hazards" target="_blank">GET /api/hazards → Multi-Hazard Polygons</a>
          </div>

          <div class="footer">
            SafeGround AI v1.0 · Node.js ${process.version} · Environment: ${config.nodeEnv}
          </div>
        </div>
      </body>
      </html>
    `);
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;

