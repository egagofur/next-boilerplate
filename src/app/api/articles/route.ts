import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db.query.articles.findMany({
    with: {
      comments: true,
      categories: true,
      articleTags: true,
    },
  });

  return NextResponse.json(result);
}
