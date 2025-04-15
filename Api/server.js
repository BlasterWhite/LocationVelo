import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";
import bicycleRouter from "./routes/BicycleRoute.js";
import maintenanceRouter from "./routes/MaintenanceRoute.js";
import replacementRouter from "./routes/ReplacementRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/bicycles", bicycleRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/replacements", replacementRouter);

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
