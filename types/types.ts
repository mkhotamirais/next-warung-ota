import { Prisma } from "@/lib/generated/prisma";

export type SortType = "price_asc" | "price_desc" | "name_asc" | "name_desc" | undefined;

export type ProductProps = Prisma.ProductGetPayload<{
  include: {
    ProductCategory: { select: { name: true; slug: true } };
    User: { select: { name: true } };
  };
}>;

export type SingleProductProps = Prisma.ProductGetPayload<{
  include: {
    ProductCategory: { select: { name: true; slug: true } };
    User: { select: { name: true } };
  };
}> & { quantity?: number };

export type BlogProps = Prisma.BlogGetPayload<{
  include: { BlogCategory: { select: { name: true; slug: true } }; User: { select: { name: true } } };
}>;
