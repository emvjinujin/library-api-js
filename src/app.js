import express from "express";
import booksRouter from "./routes/books.router.js";
import authorsRouter from "./routes/authors.js"; // <-- Энд зохиолчийн роутераа импортлох
import { logger } from "./middlewares/logger.js";
import { notFound, errorHandler } from "./middlewares/error.js";

const app = express();

app.use(express.json());
app.use(logger);

app.use("/books", booksRouter);
app.use("/authors", authorsRouter); // <-- Энд холбож өгөх

app.use(notFound);
app.use(errorHandler);

app.listen(3000);