import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  appName: `flip-cards.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

declare const global: GlobalWithMongoose;

if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(uri, options);
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }

  return global.mongoose.conn;
}

export default connect;

export function getMongoDbClient() {
  return global.mongoose.conn?.connection.getClient();
}
