const books = [
  { id: 1, title: "Node.js Basics", price: 45000, isAvailable: true },
  { id: 2, title: "React Fundamentals", price: 55000, isAvailable: false },
  { id: 3, title: "Express Guide", price: 40000, isAvailable: true },
  { id: 4, title: "JavaScript ES6+", price: 35000, isAvailable: true }
];

function sum(a, b) {
  return a + b;
}

function isExpensive(book) {
  return book.price > 50000;
}

function getTitles(books) {
  return books.map((book) => book.title);
}

function countAvailable(books) {
  return books.filter((book) => book.isAvailable).length;
}

const formatPrice = (price) => `${price}₮`;

console.log("01. sum(5, 10):", sum(5, 10));
console.log("02. isExpensive(books[1]):", isExpensive(books[1]));
console.log("03. getTitles(books):", getTitles(books));
console.log("04. countAvailable(books):", countAvailable(books));
console.log("05. formatPrice(45000):", formatPrice(45000));