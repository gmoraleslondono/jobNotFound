import express from "express";
import cors from "cors";
import jobsListRouter from "./routes/jobsList.js";

const corsOptions = {
  origin: "http://localhost:5173",
};

const app = express();

app.use(cors(corsOptions));
// app.use(express.json());

const PORT = 3000;

app.use("/api/jobsList", jobsListRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
