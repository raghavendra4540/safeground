import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hazardshield',
  jwtSecret: process.env.JWT_SECRET || 'hazardshield_dev_secret_2024',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  nodeEnv: process.env.NODE_ENV || 'development',
};
