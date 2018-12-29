import { MongoClient, Db } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017';

export let client: MongoClient;
export let db: Db;

export async function initDatabase() {
  try {
    client = await MongoClient.connect(
      MONGO_URL,
      { useNewUrlParser: true }
    );
    console.info('[Database] Connected to database.');
    db = client.db('pixelwall');

    // create indexes
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('games').createIndex({ title: 1 });
    await db.collection('jwts').createIndex({ user: 1 });
    await db.collection('jwts').createIndex({ type: 1 });
    await db.collection('jwts').createIndex({ 'token.exp': 1 });
  } catch (err) {
    console.error('[Database] Could not connect to database.', err);
    process.exit(1);
  }
}
