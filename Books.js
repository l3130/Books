// Clean, self-contained library script
// ...existing code...
const myLibrary = []; // kept for backward visibility if needed

function uuidFallback() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
}

class Book {
  constructor(title, author, pages = 0, isRead = false, genre = '') {
    this.id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : uuidFallback();
    this.title = title;
    this.author = author;
    this.pages = Number(pages) || 0;
    this.isRead = Boolean(isRead);
    this.genre = genre;
  }
}

class Library {
  constructor() {
    this.items = [];
  }

  add(title, author, pages = 0, isRead = false, genre = '') {
    const book = new Book(title, author, pages, isRead, genre);
    this.items.push(book);
    return book;
  }

  remove(id) {
    const idx = this.items.findIndex(b => b.id === id);
    if (idx !== -1) this.items.splice(idx, 1);
  }

  toggleRead(id) {
    const book = this.items.find(b => b.id === id);
    if (book) book.isRead = !book.isRead;
  }

  clear() {
    this.items.length = 0;
  }

  find(id) {
    return this.items.find(b => b.id === id);
  }
}

const library = new Library();

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function displayBooks() {
  const container = document.getElementById('library-container');
  if (!container) return;
  container.innerHTML = '';

  if (library.items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No books in your library. Click "New Book" to add one.';
    container.appendChild(empty);
    return;
  }

  library.items.forEach(book => {
    const card = document.createElement('article');
    card.className = 'book-card';
    card.dataset.bookId = book.id;
    card.innerHTML = `
      <h3>${escapeHtml(book.title)}</h3>
      <p class="meta"><strong>Author:</strong> ${escapeHtml(book.author)}</p>
      <p class="meta"><strong>Pages:</strong> ${book.pages}</p>
      ${book.genre ? `<p class="meta"><strong>Genre:</strong> ${escapeHtml(book.genre)}</p>` : ''}
      <p class="meta"><strong>Status:</strong> ${book.isRead ? 'Read' : 'Not read yet'}</p>
      <div class="card-actions">
        <button class="btn" data-action="toggle" data-id="${book.id}" type="button">Toggle Read</button>
        <button class="btn" data-action="remove" data-id="${book.id}" type="button">Remove</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function removeBook(id) {
  library.remove(id);
  displayBooks();
}

function toggleRead(id) {
  library.toggleRead(id);
  displayBooks();
}

// Delegated event handling for card buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (action === 'toggle') toggleRead(id);
  else if (action === 'remove') removeBook(id);
});

// Setup dialog, form and initial data
document.addEventListener('DOMContentLoaded', () => {
  const dlg = document.getElementById('new-book-dialog');
  const openBtn = document.getElementById('new-book-btn');
  const form = document.getElementById('new-book-form');
  const cancelBtn = document.getElementById('cancel-new-book');

  function showDialog() {
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }

  function closeDialog() {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }

  if (openBtn) openBtn.addEventListener('click', showDialog);
  if (cancelBtn) cancelBtn.addEventListener('click', closeDialog);

  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();

      const fd = new FormData(form);
      const title = (fd.get('title') || '').toString().trim();
      const author = (fd.get('author') || '').toString().trim();
      const pages = fd.get('pages') ? Number(fd.get('pages')) : 0;
      const genre = (fd.get('genre') || '').toString().trim();
      const isRead = fd.get('isRead') === 'on' || fd.get('isRead') === 'true';

      if (!title || !author) {
        alert('Please provide both title and author.');
        return;
      }

      library.add(title, author, pages, isRead, genre);
      displayBooks();
      form.reset();
      closeDialog();
    });
  }

  // sample data
  library.add('The Hobbit', 'J.R.R. Tolkien', 295, false, 'Fantasy');
  library.add('1984', 'George Orwell', 328, true, 'Dystopian');
  library.add('Pride and Prejudice', 'Jane Austen', 432, true, 'Romance');

  displayBooks();
});
// ...existing code...
