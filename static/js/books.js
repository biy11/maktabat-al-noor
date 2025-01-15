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

        // Create the book HTML
        bookDiv.innerHTML = `
          <img src="${book.image}" alt="${book.title}" />
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Price: £${book.price}</p>
          <button onclick="openModal('${book.id}')">View Details</button>
        `;

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
        <h3>${book.title}</h3>
        <img src="${book.image}" alt="${book.title}" />
        <p>Author: ${book.author}</p>
        <p>Price: £${book.price}</p>
        <p>Description: ${book.description}</p>
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
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 999999;
    const categoryFilter = document.getElementById('categoryFilter').value;

    // Filter the books based on user input
    const filteredBooks = booksData.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchInput);
        const priceMatch = book.price >= minPrice && book.price <= maxPrice;
        const categoryMatch = categoryFilter ? (book.category === categoryFilter) : true;

        return titleMatch && priceMatch && categoryMatch;
    });

    // Display the filtered results
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
