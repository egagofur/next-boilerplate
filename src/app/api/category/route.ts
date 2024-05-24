import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await db.query.categories.findMany({
    with: {
      articles: true,
    },
  });

  return NextResponse.json(result);
}
