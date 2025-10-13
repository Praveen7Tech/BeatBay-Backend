import dotenv from "dotenv";
import connectDB from "./infrastructure/mongoose/config/db";
import { connectRedis } from "./infrastructure/config/redis";
import app from "./interfaces/express/app";

dotenv.config();

const PORT = process.env.PORT;

async function startServer() {
  try {

    await connectDB();
    await connectRedis();
    console.log("hello world")

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}


startServer();
