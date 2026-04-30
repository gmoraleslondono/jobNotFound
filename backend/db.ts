import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import z from "zod";
import type { jobStatusSchema } from "./arbetsförmedlingensSchemas";

type JobStatus = z.infer<typeof jobStatusSchema>;

type Data = {
  favorites: { id: string }[];
  appliedJobs: { id: string; status: JobStatus }[];
};

// const file = join("/data", "db.json");

const db = new Low<Data>(new JSONFile("db.json"), {
  favorites: [],
  appliedJobs: [],
});
await db.read();

export { db };
