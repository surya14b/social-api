import { connect, connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod;

// Connect to the in-memory database
const connectTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  await connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// Close database connection and server
const closeTestDB = async () => {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
};

// Clear all collections in the database
const clearTestDB = async () => {
  const collections = connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export default {
  connectTestDB,
  closeTestDB,
  clearTestDB,
};