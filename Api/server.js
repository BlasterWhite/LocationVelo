import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/db.js";
import { authMiddleware } from "./middlewares/AuthMiddleware.js";
import bicycleRouter from "./routes/BicycleRoute.js";
import maintenanceRouter from "./routes/MaintenanceRoute.js";
import replacementRouter from "./routes/ReplacementRoute.js";
import accountRouter from "./routes/AccountRoute.js";
import authRoute from "./routes/AuthRoute.js";
import filterRoute from "./routes/FilterRoute.js";
import rentalRouter from "./routes/RentalRoute.js";
import reviewRouter from "./routes/ReviewRoute.js";
import newsletterRouter from "./routes/NewsletterRoute.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(authMiddleware);
app.use("/api/bicycles", bicycleRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/replacements", replacementRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/auth", authRoute);
app.use("/api/rentals", rentalRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/filters", filterRoute);
app.use("/api/newsletter", newsletterRouter);

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
