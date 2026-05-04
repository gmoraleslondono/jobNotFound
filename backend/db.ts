import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import z from "zod";
import { jobStatusSchema } from "./schemas.ts";

type JobStatus = z.infer<typeof jobStatusSchema>;

type Data = {
  favorites: { id: string }[];
  appliedJobs: { id: string; status: JobStatus }[];
};

const db = new Low<Data>(new JSONFile("data/db.json"), {
  favorites: [],
  appliedJobs: [],
});
await db.read();

export { db };
