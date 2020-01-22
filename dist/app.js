// COMPONENT: Book Class: Represents a Book

class Book {
    constructor(title, authour, isbn) {
        this.title = title;
        this.authour = authour;
        this.isbn = isbn;
    }
}

// COMPONENT: Store Class: Handles Storage (Local storage within the browser)
class Storage {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }
    static addBook(book) {
        // get books from localStorage
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Storage.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}



// COMPONENT: UI Class: Hanlde UI Tasks
class UI {
    static displayBooks() {
        const books = Storage.getBooks();
        //QUESTION: Pouvez-vous me traduire au JS ES5 ?
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");

        row.innerHTML = 
        `<td>${book.title}</td>
        <td>${book.authour}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">Supprimer</a></td>`;
        //TODO: Research list.appendChild();
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains("delete")) {
            el.parentElement.parentElement.remove()
        }
    }

    // NEW: THIS WHOLE METHOD IS FULL OF NEW STUFF
    static showAlert(message, className) {
        const div = document.createElement("div");
        // Give the div a class
        div.className = `alert alert-${className}`;
        // How to add the text IN the div
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form); //NEW: insertBefore(). translates to insert div before form

        //Vanish in 3 seconds. setTimeout takes two parametres, 1 a function, the other the time number
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#authour").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// COMPONENT:Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// COMPONENT: Event: Add a Book (Both in UI & Local Storage)
document.querySelector("#book-form").addEventListener("submit", (e) => {

    // When submitting and console.logging. info flashes rapidly.
    // pour eviter ca, faut empecher la soumission du forme.

    e.preventDefault(); //NEW:
    const title = document.querySelector("#title").value;
    const authour = document.querySelector("#authour").value;
    const isbn = document.querySelector("#isbn").value;

    // Validation: Veillez que tout les fields sont remplis
    if (title === "" || authour === "" || isbn === "") {
        UI.showAlert("Fill in all fields", "danger");
    }
    else {
        // Instantiate a book from the book class..... Aha, Je vois ça. Voila ce quoi Instantiating
        const book = new Book(title, authour, isbn); //NOTE:IMPORTANT: THIS IS INSTANTIATING
        console.log(book);

        UI.addBookToList(book);

        //Add book to storage
        Storage.addBook(book);
        //Show success message
        UI.showAlert("Book Added", "success");
        UI.clearFields();
    }
});

// COMPONENT: Event: Remove a Book (Both in UI & Local Storage)
document.querySelector("#book-list").addEventListener("click", (e) => {
    console.log(e.target);
    UI.deleteBook(e.target);


    //Remove book from storage. We're traversing the DOM to get ISBN
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert("Book Removed", "success");
});

//QUESTION: WHAT IS LOCAL STORAGE?