import dotenv from 'dotenv';

dotenv.config();

export const config = {
	nodeEnv: process.env.NODE_ENV || 'development',
	port: parseInt(process.env.PORT || '4000', 10),
	mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intervyou',
	jwtSecret: process.env.JWT_SECRET || 'change-me-in-env',
	corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

