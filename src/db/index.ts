import { DbConnectionError } from "@/util/customErrors";
import mongoose from "mongoose";

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

export const dbConnect = async () => {
  if (cached.conn) {
    console.log("the db pre return: " + cached.conn);
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    };
    cached.promise = mongoose.connect(
      process.env.DATABASE_URL!,
      opts
    ).then((m) => m.connection);
  }
  try {
    cached.conn = await cached.promise;
    console.log("connected to database...");
    return cached.conn;
  }
  catch (e: any) {
    cached.promise = null;
    cached.conn = null;
    throw new DbConnectionError();
  }
}