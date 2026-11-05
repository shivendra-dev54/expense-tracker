import { DbConnectionError } from "@/util/customErrors";
import mongoose from "mongoose";

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

let cached = global.mongoose;

export const dbConnect = async () => {
  if (cached.conn) {
    // console.log("the db pre return: " + cached.conn);
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
    console.log("connecting to database...");
    cached.conn = await cached.promise;
    console.log("connected to database...");
    return cached.conn;
  }
  catch (e: any) {
    console.log("connection to the database failed...")

    console.log("\n\n\n\n\n", e, "\n\n\n\n\n")
    cached.promise = null;
    cached.conn = null;
    throw new DbConnectionError();
  }
}