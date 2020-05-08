// Book Constructor
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

// UI constructor
class UI {
	// Add Book To the List
	addBookToList = function (book) {
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
	delBook = function (book) {
		if (book.className === "delete") {
			book.parentElement.parentElement.remove();
		}
	};

	// FeedBack Messages
	showAlert = (msg, className) => {
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
	clearInputs = () => {
		document.getElementById("title").value = "";
		document.getElementById("author").value = "";
		document.getElementById("isbn").value = "";
	};
}

// Store Books in local storage
class Store {
	static getBook() {
		let books;
		if (localStorage.getItem("books") === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem("books"));
		}
		return books;
	}

	static addBook(book) {
		const books = Store.getBook();
		books.push(book);
		localStorage.setItem("books", JSON.stringify(books));
	}

	static removeBook(bookIsbn) {
		const books = Store.getBook();
		books.forEach((book, index) => {
			if (book.isbn === bookIsbn) {
				books.splice(index, 1);
			}
			localStorage.setItem("books", JSON.stringify(books));
		});
	}

	static displayBook() {
		const storedBooks = this.getBook();
		storedBooks.forEach((book) => {
			const ui = new UI();
			ui.addBookToList(book);
		});
	}
}

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
		// add book to LS
		Store.addBook(newBook);
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
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});

document.addEventListener("DOMContentLoaded", Store.displayBook.bind(Store));

// for (const key in localStorage) {
// 	console.log(key);
// }

// for (let i = 0; i < localStorage.length; i++) {
// 	const key = localStorage.key(i);
// 	const value = localStorage.getItem(key);
// 	console.log(`KEY: ${key} ==> VALUE: ${value}`);
// }

// for (const key in localStorage) {
// 	if (localStorage.hasOwnProperty(key)) {
// 		console.log(`${key} ===> ${localStorage.getItem(key)}`);
// 	}
// }

// for (const key in localStorage) {
// 	if (!localStorage.hasOwnProperty(key)) {
// 		continue;
// 	}
// 	console.log(localStorage.getItem(key));
// }

// const keys = Object.keys(localStorage);
// for (const i of keys) {
// 	console.log(localStorage.getItem(i));
// }
