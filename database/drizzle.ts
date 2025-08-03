import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config  from "@/lib/config";
// import {config} from "dotenv";

// or .env.local

const sql = neon(config.env.datsbaseUrl);
export const db = drizzle({ client: sql });
