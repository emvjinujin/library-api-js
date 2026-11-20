import { prisma } from "../db.js";
import { findPage } from "./paging.js";


function queryError(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function integerQuery(value, name, minimum = 0) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw queryError(name + " must be an integer");
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum || number > 2147483647) {
    throw queryError(name + " is outside the allowed range");
  }
  return number;
}

function textQuery(value, name) {
  if (typeof value !== "string" || !value.trim()) {
    throw queryError(name + " must be a non-empty string");
  }
  return value.trim();
}

export function buildWhere(query) {
  const where = {};
  if (query.authorId !== undefined) {
    where.authorId = integerQuery(query.authorId, "authorId", 1);
  }
  if (query.available !== undefined) {
    if (query.available !== "true" && query.available !== "false") {
      throw queryError("available must be true or false");
    }
    where.isAvailable = query.available === "true";
  }
  if (query.q !== undefined) {
    where.title = { contains: textQuery(query.q, "q"), mode: "insensitive" };
  }
  if (query.author !== undefined) {
    where.author = {
      name: { contains: textQuery(query.author, "author"), mode: "insensitive" },
    };
  }
  const price = {};
  if (query.minPrice !== undefined) {
    price.gte = integerQuery(query.minPrice, "minPrice");
  }
  if (query.maxPrice !== undefined) {
    price.lte = integerQuery(query.maxPrice, "maxPrice");
  }
  if (price.gte !== undefined && price.lte !== undefined && price.gte > price.lte) {
    throw queryError("minPrice must not exceed maxPrice");
  }
  if (Object.keys(price).length) where.price = price;
  if (query.ids !== undefined) {
    where.id = {
      in: textQuery(query.ids, "ids").split(",").map((id) => integerQuery(id, "ids", 1)),
    };
  }
  return where;
}

export function buildOrderBy(query) {
  const allowed = ["title", "price", "createdAt"];
  const rawSort = typeof query.sort === "string" ? query.sort : "";
  const descending = rawSort.startsWith("-");
  const field = descending ? rawSort.slice(1) : rawSort;
  const sort = allowed.includes(field) ? field : "createdAt";
  const defaultOrder = rawSort && allowed.includes(field) && !descending ? "asc" : "desc";
  const order = query.order === "asc" || query.order === "desc"
    ? query.order
    : defaultOrder;
  return { [sort]: order };
}

export async function getBooks(req, res, next) {
  try {
    const result = await findPage(prisma.book, req.query, {
      where: buildWhere(req.query),
      orderBy: [buildOrderBy(req.query), { id: "asc" }],
      include: { author: true }
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    const book = await prisma.book.findUnique({
      where: { id },
      include: { author: true }
    });
    if (!book) return res.status(404).json({ message: "Олдсонгүй" });
    res.json(book);
  } catch (error) {
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const { title, price, authorId } = req.body;
    if (!title || typeof price !== "number" || !authorId) {
      return res.status(400).json({ message: "Мэдээлэл дутуу" });
    }

    const book = await prisma.book.create({
      data: { title, price, authorId }
    });
    res.status(201).json(book);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({ message: "Зохиолч олдсонгүй" });
    }
    next(err);
  }
}

export async function updateBook(req, res, next) {
  const id = Number(req.params.id);
  try {
    const book = await prisma.book.update({ where: { id }, data: req.body });
    res.json(book);
  } catch (err) {
    if (err.code === "P2003") {
      return res.status(400).json({ message: "Зохиолч олдсонгүй" });
    }
    res.status(404).json({ message: "Олдсонгүй" });
  }
}

export async function deleteBook(req, res, next) {
  const id = Number(req.params.id);
  try {
    await prisma.book.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ message: "Олдсонгүй" });
  }
}