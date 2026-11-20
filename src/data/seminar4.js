// import { books, findBookById } from "./books.js";
// import { books, findBookById, getBooksFromDb } from "./books.js";
import { books, findBookById, getBooksFromDb, getBookOrThrow } from "./books.js";

// Дасгал1
const book = {
  id: 1,
  title: "Cheegii",
  author: "Iveel",
  price: 47000,
  isAvailable: true
};

console.log(book.title);
console.log(book["title"]);
console.log(book.hair);

book.price = 50000;
console.log(book.price);


//Дасгал2
// const books = [
//   { id: 1, title: "Cheegii", price: 247000, isAvailable: true },
//   { id: 2, title: "Veve", price: 12000, isAvailable: false },
//   { id: 3, title: "Iveele", price: 12000, isAvailable: false },
//   { id: 4, title: "Ulaana", price: 27000, isAvailable: true }
// ];

console.log(books);

const titles = books.map((book) => book.title);
console.log(titles);

const labels = books.map((book) => `${book.title} — ${book.price}`);
console.log(labels);

console.log(books.length);


//Дасгал3
const cheap = books.filter((book) => book.price < 50000);
console.log(cheap);

const available = books.filter((book) => book.isAvailable);
console.log(available);

const book3 = books.find((book) => book.id === 3);
console.log(book3);

const book99 = books.find((book) => book.id === 99);
console.log(book99 ?? "not found");


//Дасгал4
function sum(a, b) {
  return a + b;
}
console.log(sum(3, 4)); // 7


function isExpensive(book) {
  if (book.price > 50000) {
    return true;
  } else {
    return false;
  }
}
console.log(isExpensive(book))


function getTitles(books) {
  return books.map((book) => book.title);
}
console.log(getTitles(books));


function countAvailable(books) {
  return books.filter((book) => book.isAvailable).length;
}
console.log(countAvailable(books));


const formatPrice = (price) => {
  return `${price}₮`;
};
console.log(formatPrice(45000));
console.log(books);
console.log(findBookById(3));

//Дасгал6
async function main() {
  const dbBooks = await getBooksFromDb();
  console.log(dbBooks);
}
main();

//Дасгал7
try {
  const book = getBookOrThrow(1);
  console.log(book);
} catch (error) {
  console.log("Алдаа гарлаа:", error.message);
}