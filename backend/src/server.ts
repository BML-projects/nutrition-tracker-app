import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";

connectDB();

const PORT = Number(process.env.PORT) || 5000;
const NGROK_URL = process.env.EXPO_PUBLIC_BACKEND_URL

app.listen(PORT, '0.0.0.0', () => {  // ← Add '0.0.0.0' here
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at backend: ${NGROK_URL}`);
});