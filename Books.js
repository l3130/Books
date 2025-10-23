const myLibrary = [];

function Book(title, author, pages, isRead) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead;
}

function addBookToLibrary(title, author, pages, isRead) {
    const newBook = new Book(title, author, pages, isRead);
    myLibrary.push(newBook);
    return newBook;
}
function displayBooks() {
    const libraryContainer = document.getElementById('library-container');
    libraryContainer.innerHTML = ''; // Clear existing display

    myLibrary.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.dataset.bookId = book.id;

        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Pages: ${book.pages}</p>
            <p>Status: ${book.isRead ? 'Read' : 'Not read yet'}</p>
            <button onclick="toggleRead('${book.id}')">Toggle Read Status</button>
            <button onclick="removeBook('${book.id}')">Remove</button>
        `;

        libraryContainer.appendChild(bookCard);
    });
}
// Display helpers and DOM wiring
function escapeHtml(str = '') {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function displayBooks() {
    const libraryContainer = document.getElementById('library-container');
    if (!libraryContainer) return;
    libraryContainer.innerHTML = '';

    myLibrary.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.dataset.bookId = book.id;

        bookCard.innerHTML = `
            <h3>${escapeHtml(book.title)}</h3>
            <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Status:</strong> ${book.isRead ? 'Read' : 'Not read yet'}</p>
            <div class="card-actions">
                <button data-action="toggle" data-id="${book.id}">Toggle Read</button>
                <button data-action="remove" data-id="${book.id}">Remove</button>
            </div>
        `;
               libraryContainer.appendChild(bookCard);
    });
}

function removeBook(id) {
    const idx = myLibrary.findIndex(b => b.id === id);
    if (idx !== -1) {
        myLibrary.splice(idx, 1);
        displayBooks();
    }
}

function toggleRead(id) {
    const book = myLibrary.find(b => b.id === id);
    if (book) {
        book.isRead = !book.isRead;
        displayBooks();
    }
}
// Event delegation for card buttons
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const id = btn.dataset.id;
    if (action === 'toggle') toggleRead(id);
    if (action === 'remove') removeBook(id);
});

// Form/dialog handling and initial setup
document.addEventListener('DOMContentLoaded', () => {
    const dlg = document.getElementById('new-book-dialog');
    const btn = document.getElementById('new-book-btn');
    const form = document.getElementById('new-book-form');
    const cancelBtn = document.getElementById('cancel-new-book');

    if (btn && dlg) {
        btn.addEventListener('click', () => dlg.showModal());
    }

    if (cancelBtn && dlg) {
        cancelBtn.addEventListener('click', () => dlg.close());
    }

    if (form) {
        form.addEventListener('submit', (event) => {
            // Prevent the browser from trying to submit the form to a server
            event.preventDefault();
                  const fd = new FormData(form);
            const title = (fd.get('title') || '').toString().trim();
            const author = (fd.get('author') || '').toString().trim();
            const pages = Number(fd.get('pages')) || 0;
            const isRead = fd.get('isRead') === 'on';

            if (title && author) {
                addBookToLibrary(title, author, pages, isRead);
                displayBooks();
                form.reset();
                dlg.close();
            } else {
                // Minimal feedback; you can expand validation/UI later
                alert('Please provide both title and author.');
            }
        });
    }

    // Add a couple sample books to demonstrate the UI
    addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295, false);
    addBookToLibrary('1984', 'George Orwell', 328, true);
    displayBooks();
});