import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keywords = searchParams.get("keywords");

  if (!keywords) return Response.json([]);

  try {
    const products = await prisma.product.findMany({
      where: { name: { contains: keywords, mode: "insensitive" } },
      select: { name: true },
      distinct: ["name"],
      orderBy: { name: "asc" },
      take: 10,
    });
    return Response.json(products);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
