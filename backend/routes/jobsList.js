import { Router } from "express";
import axios from "axios";

const router = Router();

const JOBS_API_URL =
  "https://jobsearch.api.jobtechdev.se/search?municipality=AvNB_uwa_6n6&q=frontend&offset=0&limit=10";

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(JOBS_API_URL);
    res.json(response.data);
    console.log("API response:", response.data); // Log the API response
    console.log("Job listings fetched successfully.");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching job listings." });
  }
});

export default router;
