// Book Constructor
function Book(title, author, isbn) {
	this.title = title;
	this.author = author;
	this.isbn = isbn;
}

// UI constructor
function UI() {}

// Add Book To the List
UI.prototype.addBookToList = function (book) {
	const bookList = document.getElementById("book-list");
	const bookElm = document.createElement("tr");
	bookElm.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="delete">X</a></td>
		`;
	bookList.append(bookElm);
};

// Delete Book from list
UI.prototype.delBook = function (book) {
	if (book.className === "delete") {
		book.parentElement.parentElement.remove();
	}
};

// FeedBack Messages
UI.prototype.showAlert = (msg, className) => {
	const feedElm = document.createElement("div");
	feedElm.append(document.createTextNode(msg));
	feedElm.className = `alert ${className}`;
	const container = document.querySelector(".container");
	const bookForm = document.getElementById("book-form");
	container.insertBefore(feedElm, bookForm);

	setTimeout(() => {
		feedElm.remove();
	}, 3000);
};

// Clear Input Fields
UI.prototype.clearInputs = () => {
	document.getElementById("title").value = "";
	document.getElementById("author").value = "";
	document.getElementById("isbn").value = "";
};

// Store Books in local storage
function Store() {}
Store.prototype.getBook = function () {
	let books;
	if (localStorage.getItem("books") === null) {
		books = [];
	} else {
		books = JSON.parse(localStorage.getItem("books"));
	}
	return books;
};

Store.prototype.addBook = function (book) {
	const store = new Store();
	const books = store.getBook();
	books.push(book);
	localStorage.setItem("books", JSON.stringify(books));
};

Store.prototype.removeBook = function (isbn) {
	const store = new Store();
	const books = store.getBook();
	books.forEach((book, index) => {
		if (book.isbn === isbn) {
			books.splice(index, 1);
		}
		localStorage.setItem("books", JSON.stringify(books));
	});
};

Store.prototype.showBooks = function () {
	const store = new Store();
	const books = store.getBook();
	books.forEach((book) => {
		const ui = new UI();
		ui.addBookToList(book);
	});
};

// Event listeners
const bookForm = document.getElementById("book-form");
bookForm.addEventListener("submit", (e) => {
	e.preventDefault();

	// Get form values
	const title = bookForm.querySelector("#title").value;
	const author = bookForm.querySelector("#author").value;
	const isbn = bookForm.querySelector("#isbn").value;

	// create a new book
	const newBook = new Book(title, author, isbn);

	// Update the UI
	const ui = new UI();

	if (title === "" || author === "" || isbn === "") {
		ui.showAlert("please fill in all fields", "error");
	} else {
		ui.addBookToList(newBook);
		const store = new Store();
		store.addBook(newBook);
		ui.showAlert("Book added Successfully", "success");
		ui.clearInputs();
	}
});

// Delete Book
const bookList = document.getElementById("book-list");
bookList.addEventListener("click", (e) => {
	e.preventDefault();
	const ui = new UI();
	ui.delBook(e.target);
	ui.showAlert("book removed!", "success");
	const store = new Store();
	store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});

window.addEventListener("DOMContentLoaded", () => {
	const store = new Store();
	store.showBooks();
});
