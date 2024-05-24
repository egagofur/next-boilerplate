import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";

export default async function Home() {
  const result = await db.select().from(categories);

  return <div>{JSON.stringify(result)}</div>;
}
