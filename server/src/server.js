import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import app from './app.js';
import Settlement from './models/Settlement.js';
import { seedDatabase } from './seed/seed.js';

const start = async () => {
  await connectDB();

  // Auto-seed if database is freshly initialized (0 settlements)
  try {
    const settlementCount = await Settlement.countDocuments();
    if (settlementCount === 0) {
      console.log('🌱 Fresh deployment detected (0 settlements). Auto-seeding Pan-India dataset...');
      await seedDatabase({ clear: false });
    }
  } catch (seedErr) {
    console.warn('⚠️ Auto-seed check notice:', seedErr.message);
  }

  const server = app.listen(config.port, () => {
    console.log(`\n🛡️  SafeGround AI Production Server`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🚀 Port:        ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🤖 AI Mode:     ${config.aiApiKey ? 'Live (' + config.aiModel + ')' : 'Deterministic Intelligence'}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      console.log('💤 HTTP server closed');
      try {
        await mongoose.connection.close(false);
        console.log('💾 MongoDB connection closed');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB:', err);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

start();

