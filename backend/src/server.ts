import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

connectDB();

const PORT = process.env.PORT || 3000;
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Server running' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
