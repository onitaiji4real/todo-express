const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

let _db = null;

async function connectToDatabase() {
  if (!_db) {
    const connectionURL = process.env.DB_URL;
    const dbName = process.env.DB_NAME;
    console.log(`Connecting to database: ${dbName}`);

    const client = new MongoClient(connectionURL);

    await client.connect();
    _db = client.db(dbName);
  }

  return _db;
}

async function ping() {
  const db = await connectToDatabase();
  await db.command({ ping: 1 });
  console.log("Pinged the database...");
}
ping();

module.exports = { connectToDatabase, ping };
