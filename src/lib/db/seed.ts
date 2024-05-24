import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { articleOnTags, articles, categories, comments, tags } from "./schema";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "boilerplate",
});

const db = drizzle(pool);

async function main() {
  console.log("Seeding your database...");

  for (let i = 0; i < 10; i++) {
    const category = await db
      .insert(categories)
      .values({
        name: `Category ${i}`,
      })
      .returning();

    const tag = await db
      .insert(tags)
      .values({
        name: `Tag ${i}`,
      })
      .returning();

    const article = await db
      .insert(articles)
      .values({
        title: `Article ${i}`,
        content: `Content ${i}`,
        categoryId: category[0].id,
        status: "published",
      })
      .returning();

    const commant = await db.insert(comments).values({
      articleId: article[0].id,
      content: `Comment ${i}`,
    });

    const articleOnTag = await db
      .insert(articleOnTags)
      .values([
        {
          articleId: article[0].id,
          tagId: tag[0].id,
        },
      ])
      .returning();
  }

  console.log("Woohoo! Seeding completed!");
  return process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
