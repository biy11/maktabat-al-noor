let booksData = []; // Will store the array of books from JSON

document.addEventListener('DOMContentLoaded', () => {
    console.log("Document loaded. Fetching books...");
    fetch('static/data/books.json')
        .then(response => {
            console.log("Received response:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            booksData = data;
            displayBooks(booksData);
        })
        .catch(error => console.error('Error fetching books:', error));
});

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear existing content

    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book';
        bookDiv.dataset.bookId = book.id;

        // Create the book HTML
        bookDiv.innerHTML = `
          <img src="${book.image}" alt="${book.title}" />
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Price: £${book.price.toFixed(2)}</p>
          <p>Available: ${book.quantity}</p>
          ${book.quantity === 0 ? '<div class="sold-out">SOLD OUT</div>': ''}
        `;

        // Click event lsitner for book
        bookDiv.addEventListener('click',()=>{
            openModal(book.id);
        })

        bookList.appendChild(bookDiv);

        // Create a corresponding modal for each book
        createModal(book);
    });
}

function createModal(book) {
    // Check if modal already exists
    if (document.getElementById(book.id)) return;

    // Create the modal div
    const modalDiv = document.createElement('div');
    modalDiv.className = 'modal';
    modalDiv.id = book.id;

    modalDiv.innerHTML = `
      <div class="modal-content">
        <span class="close" onclick="closeModal('${book.id}')">&times;</span>
        <h3 class="modal-book-title">${book.title}</h3> <!-- Title first -->
        <div class="modal-book-image">
          <img src="${book.image}" alt="${book.title}" />
        </div>
        <div class="modal-book-info">
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Price:</strong> £${book.price.toFixed(2)}</p>
          <p><strong>Description:</strong> ${book.description}</p>
        </div>
      </div>
    `;

    // Append the modal to body so it can be opened from anywhere
    document.body.appendChild(modalDiv);
}


function applyFilters() {
    filterBooks();
}

function applySearch() {
    filterBooks();
}

function searchEnter(event) {
    if (event.key === "Enter") {
        applySearch();
    }
}

function filterBooks() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const sortFilter = document.getElementById('sortFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const inStockFilter = document.getElementById('inStockFilter').checked;

    // Filter the books based on user input
    let filteredBooks = booksData.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchInput);
        const categoryMatch = categoryFilter ? (book.category === categoryFilter) : true;
        const inStockMatch = inStockFilter ? (book.quantity > 0) : true; // Include only books with quantity > 0 if filter is checked

        return titleMatch && categoryMatch && inStockMatch;
    });

    // Apply sorting
    switch (sortFilter) {
        case 'priceIncreasing':
            filteredBooks.sort((a, b) => a.price - b.price);
            break;
        case 'priceDecreasing':
            filteredBooks.sort((a, b) => b.price - a.price);
            break;
        case 'alphabetical':
            filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            // No sorting
            break;
    }

    // Display the filtered and sorted results
    displayBooks(filteredBooks);
}

function toggleFilters() {
    var filterOptions = document.getElementById('filterOptions');
    if (filterOptions.style.display === 'none') {
        filterOptions.style.display = 'block';
    } else {
        filterOptions.style.display = 'none';
    }
}
