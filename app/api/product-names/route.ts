import prisma from "@/lib/prisma";

export const GET = async (req: Request) => {
  const keywords = req.url.split("?keyword=")[1] || "";

  if (!keywords) return Response.json([]);

  const whereClause: {
    name?: { contains: string; mode: "insensitive" };
  } = {};
  if (keywords) whereClause.name = { contains: keywords, mode: "insensitive" };

  const products = await prisma.product.findMany({
    where: whereClause,
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
  return Response.json(products);
};
