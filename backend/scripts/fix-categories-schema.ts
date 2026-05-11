import { db } from "../src/config/db.js";
import { sql } from "drizzle-orm";

async function fixSchema() {
  try {
    console.log("Altering featured_categories table...");
    await db.execute(sql`ALTER TABLE featured_categories MODIFY COLUMN image MEDIUMTEXT`);
    
    console.log("✅ Schema updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating schema:", error);
    process.exit(1);
  }
}

fixSchema();
