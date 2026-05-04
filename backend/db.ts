import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import z from "zod";
import { jobStatusSchema } from "./schemas.ts";

const dbFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "data",
  "db.json"
);

type JobStatus = z.infer<typeof jobStatusSchema>;

type Data = {
  favorites: { id: string }[];
  appliedJobs: { id: string; status: JobStatus }[];
};

const db = new Low<Data>(new JSONFile(dbFilePath), {
  favorites: [],
  appliedJobs: [],
});
await db.read();

export { db };
