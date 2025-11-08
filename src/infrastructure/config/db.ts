import mongoose from "mongoose";
import dotenv from "dotenv"
import logger from "../utils/logger/logger";
dotenv.config()

const connectDB = async() => {
    try {
        const mongoURL = process.env.MONGO_URL
        if(!mongoURL) throw new Error("DB URL not defined")
        await mongoose.connect(mongoURL)
        logger.info("mongo db connected successfully")
    } catch (error) {
        console.error("Error in DB connection", error)
        process.exit(1)
    }
}

export default connectDB