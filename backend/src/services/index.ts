import { MongoClient, Db } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/pixelwall'

export let mongoClient: MongoClient;
export let db: Db;

export async function initDatabase() {
  return MongoClient.connect(MONGO_URL)
    .then((client) => {
      console.info("Connected to database.");
      mongoClient = client;
      db = client.db('pixelwall');
    })
    .catch((err) => {
      console.error("Could not connect to database.");
      process.exit(1);
    });
}
