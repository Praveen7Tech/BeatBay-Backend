import connectDB from "./infrastructure/mongoose/config/db";
import app from "./interfaces/express/app";
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT

connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
