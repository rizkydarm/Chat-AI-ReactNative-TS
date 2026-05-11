import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat_with_ai';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Connect to MongoDB with Mongoose
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Define Schema
const chatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Routes
app.get('/health', (_: Request, res: Response) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Get all chats
app.get('/chats', async (_: Request, res: Response) => {
  const chats = await Chat.find().sort({ createdAt: -1 }).limit(50);
  res.json(chats);
});

// Create a chat
app.post('/chats', async (req: Request, res: Response) => {
  const { userId, message, response } = req.body;
  const chat = new Chat({ userId, message, response });
  await chat.save();
  res.status(201).json(chat);
});

// Delete a chat
app.delete('/chats/:id', async (req: Request, res: Response) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});