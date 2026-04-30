import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import z from "zod";
import type { jobStatusSchema } from "./schemas";

type JobStatus = z.infer<typeof jobStatusSchema>;

type Data = {
  favorites: { id: string }[];
  applied: { id: string; status: JobStatus }[];
};

// const file = join("/data", "db.json");

const db = new Low<Data>(new JSONFile("db.json"), {
  favorites: [],
  applied: [],
});
await db.read();

export { db };
