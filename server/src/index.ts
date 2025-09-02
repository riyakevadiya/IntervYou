import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';
import { config } from './config';

async function start() {
	const app = express();
	app.use(cors({ origin: config.corsOrigin }));
	app.use(express.json({ limit: '1mb' }));

	app.get('/', (_req, res) => res.send('IntervYou API is running. See /health and /api.'));
	app.get('/health', (_req, res) => res.json({ ok: true }));
	app.use('/api', routes);

	await mongoose.connect(config.mongoUri);
	console.log('Connected to MongoDB');

	app.listen(config.port, () => {
		console.log(`API listening on http://localhost:${config.port}`);
	});
}

start().catch((err) => {
	console.error('Fatal startup error', err);
	process.exit(1);
});
