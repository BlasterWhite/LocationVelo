import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log("BD_HOST", process.env.DB_HOST);
console.log("DB_PORT", process.env.DB_PORT);
console.log("DB_USER", process.env.DB_USER);
console.log("DB_PASSWORD", process.env.DB_PASSWORD);
console.log("DB_NAME", process.env.DB_NAME);

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to the database");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
