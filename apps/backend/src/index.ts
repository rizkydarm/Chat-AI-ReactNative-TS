import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { MongoClient } from 'mongodb';
import 'dotenv/config';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/chat_with_ai';

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

let db: ReturnType<typeof MongoClient.prototype.db>;

(async () => {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db();
  console.log('✅ Connected to MongoDB');
})();

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});