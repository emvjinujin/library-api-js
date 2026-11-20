import { prisma } from "../db.js";

export async function getAuthors(req, res, next) {
  try {
    const q = req.query.q;
    if (q !== undefined && (typeof q !== "string" || !q.trim())) {
      return res.status(400).json({ message: "q must be a non-empty string" });
    }
    const authors = await prisma.author.findMany({
      where: q === undefined ? {} : {
        name: { contains: q.trim(), mode: "insensitive" },
      },
    });
    res.json(authors);
  } catch (error) {
    next(error);
  }
}

export async function getAuthor(req, res, next) {
  try {
    const id = Number(req.params.id);
    const author = await prisma.author.findUnique({
      where: { id }
    });

    if (!author) {
      return res.status(404).json({ message: "Зохиолч олдсонгүй" });
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
}

export async function createAuthor(req, res, next) {
  try {
    const { name, email } = req.body;
    const author = await prisma.author.create({
      data: { name, email }
    });
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
}

export async function getAuthorBooks(req, res, next) {
  try {
    const authorId = Number(req.params.id);

    const author = await prisma.author.findUnique({
      where: { id: authorId },
      include: { books: true } 
    });

    if (!author) {
      return res.status(404).json({ message: "Зохиолч олдсонгүй" }); //[cite: 9]
    }

    res.json(author.books); 
  } catch (error) {
    next(error);
  }
}