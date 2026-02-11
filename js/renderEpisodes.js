const cardsContainer = document.getElementById("episodeCards");
const bookSelect = document.getElementById("bookSelect");

// Get unique books in order
const books = [...new Set(episodes.map(e => e.book))];

// Populate dropdown
books.forEach(book => {
  const option = document.createElement("option");
  option.value = book;
  option.textContent = book;
  bookSelect.appendChild(option);
});

// Default book
let currentBook = books[0];

// Render episodes for selected book
function renderEpisodes(book) {
  cardsContainer.innerHTML = "";

  episodes
    .filter(ep => ep.book === book)
    .forEach(ep => {
      const isUnlocked =
        !ep.locked ||
        localStorage.getItem(`unlocked:${ep.id}`) === "true";

      if (isUnlocked) {
        cardsContainer.innerHTML += `
          <a class="card" href="episodes/reader.html?id=${ep.id}">
            ${ep.title}<br />
            <span>${ep.subtitle}</span>
          </a>
        `;
      } else {
        cardsContainer.innerHTML += `
          <div class="card locked">
            ${ep.title}<br />
            <span>${ep.subtitle}</span>
          </div>
        `;
      }
    });
}

// Initial render
renderEpisodes(currentBook);

// Change book
bookSelect.addEventListener("change", e => {
  currentBook = e.target.value;
  renderEpisodes(currentBook);
});

// Restore book selection
const savedBook = localStorage.getItem("lastBook");
if (savedBook && books.includes(savedBook)) {
  bookSelect.value = savedBook;
  currentBook = savedBook;
}

// Save book on change
bookSelect.addEventListener("change", e => {
  currentBook = e.target.value;
  localStorage.setItem("lastBook", currentBook);
  renderEpisodes(currentBook);
});
