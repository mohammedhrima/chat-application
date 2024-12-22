import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { config } from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, "../.env")});

const PORT = process.env.PORT || 5000;
const USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME
const PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD

const MONGO_URL = `mongodb://${USERNAME}:${PASSWORD}@localhost:27017/chat?authSource=admin`;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes)

mongoose.connect(MONGO_URL, {})
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("Database connection error:", err.message);
    process.exit(1);
  });

app.post("/auth", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });
    return res.json({ username, secret: "sha256..." });
  } catch (err) {
    console.error("Error handling /auth:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});