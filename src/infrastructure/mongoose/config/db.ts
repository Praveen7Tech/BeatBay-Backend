import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()



const connectDB = async() => {
    try {
        const mongoURL = process.env.MONGO_URL
        if(!mongoURL) throw new Error("DB URL not defined")
        await mongoose.connect(mongoURL)
        console.log("mongo db connected successfully")
    } catch (error) {
        console.error("Error in DB connection")
        process.exit(1)
    }
}

export default connectDB