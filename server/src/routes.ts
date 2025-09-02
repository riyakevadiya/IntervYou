import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, InterviewSession } from './models';
import { config } from './config';
import { generateUniqueQuestions } from './ai';

const router = Router();

function createToken(userId: string) {
	return jwt.sign({ sub: userId }, config.jwtSecret, { expiresIn: '7d' });
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Missing token' });
	}
	const token = authHeader.slice('Bearer '.length);
	try {
		const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
		(req as any).userId = payload.sub;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

// Auth
router.post('/auth/register', async (req, res) => {
	try {
		const { username, email, password } = req.body as { username: string; email: string; password: string };
		if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
		const exists = await User.findOne({ $or: [{ username }, { email }] });
		if (exists) return res.status(409).json({ message: 'Username or email already exists' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ username, email, passwordHash });
		const token = createToken(user.id);
		return res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email } });
	} catch (e) {
		return res.status(500).json({ message: 'Registration failed' });
	}
});

router.post('/auth/login', async (req, res) => {
	try {
		const { username, password } = req.body as { username: string; password: string };
		if (!username || !password) return res.status(400).json({ message: 'Missing fields' });
		const user = await User.findOne({ $or: [{ username }, { email: username }] });
		if (!user) return res.status(404).json({ message: 'User not found' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		user.lastLogin = new Date();
		await user.save();
		const token = createToken(user.id);
		return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
	} catch (e) {
		return res.status(500).json({ message: 'Login failed' });
	}
});

router.get('/auth/me', authMiddleware, async (req, res) => {
	const user = await User.findById((req as any).userId).select('username email');
	if (!user) return res.status(404).json({ message: 'Not found' });
	return res.json({ id: user.id, username: user.username, email: user.email });
});

// AI - generate questions (non-repeating per user)
router.post('/ai/generate-questions', authMiddleware, async (req, res) => {
	try {
		const userId = (req as any).userId as string;
		const { type, role, level, count } = req.body as { type: string; role: string; level: string; count?: number };
		if (!type || !role || !level) return res.status(400).json({ message: 'Missing fields' });
		const questions = await generateUniqueQuestions({ userId, type, role, level, count: count || 5 });
		return res.json({ questions });
	} catch (e: any) {
		return res.status(500).json({ message: e?.message || 'Failed to generate questions' });
	}
});

// Sessions
router.post('/sessions', authMiddleware, async (req, res) => {
	try {
		const userId = (req as any).userId as string;
		const { type, level, role, duration, score, feedback, strengths, improvements } = req.body;
		const session = await InterviewSession.create({
			userId,
			type,
			level,
			role,
			duration,
			score,
			feedback,
			strengths,
			improvements,
		});
		return res.status(201).json(session);
	} catch (e) {
		return res.status(500).json({ message: 'Failed to create session' });
	}
});

router.get('/sessions', authMiddleware, async (req, res) => {
	const userId = (req as any).userId as string;
	const sessions = await InterviewSession.find({ userId }).sort({ createdAt: -1 });
	return res.json(sessions);
});

router.get('/sessions/:id', authMiddleware, async (req, res) => {
	const userId = (req as any).userId as string;
	const session = await InterviewSession.findOne({ _id: req.params.id, userId });
	if (!session) return res.status(404).json({ message: 'Not found' });
	return res.json(session);
});

router.delete('/sessions/:id', authMiddleware, async (req, res) => {
	const userId = (req as any).userId as string;
	await InterviewSession.deleteOne({ _id: req.params.id, userId });
	return res.json({ ok: true });
});

export default router;
