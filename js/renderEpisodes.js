/**
 * js/renderEpisodes.js
 * Chapter card generation with sequential unlocking.
 */
const cardsContainer = document.getElementById("episodeCards");
const bookSelect = document.getElementById("bookSelect");
const books = [...new Set(episodes.map(e => e.book))];

// Populate Dropdown
books.forEach(book => {
    const opt = document.createElement("option");
    opt.value = book; opt.textContent = book;
    bookSelect.appendChild(opt);
});

function renderEpisodes(book) {
    cardsContainer.innerHTML = "";
    const filtered = episodes.filter(ep => ep.book === book);

    filtered.forEach((ep, i) => {
        const prevEpId = i > 0 ? filtered[i-1].id : null;
        const isRead = localStorage.getItem(`read:${ep.id}`) === "true";
        const prevRead = prevEpId ? localStorage.getItem(`read:${prevEpId}`) === "true" : false;

        const isUnlocked = i === 0 || isRead || prevRead || !ep.locked;
        
        // --- NEW LOGIC FOR THE CROWN ICON ---
        let displayLabel;
        if (ep.id === 'finale') {
            // Minimalist Crown SVG
            displayLabel = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6;"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"></path></svg>`;
        } else {
            displayLabel = ep.id.startsWith('ep') ? ep.id.replace('ep', '').padStart(2, '0') : '--';
        }
        
        const cardHTML = isUnlocked ? `
            <a class="card" href="javascript:void(0)" onclick="navigateWithSound('episodes/reader.html?id=${ep.id}')">
                <div class="card-content">
                    <span class="ep-number">${displayLabel}</span>
                    <div class="ep-text">
                        <div class="ep-title">${ep.title}</div>
                        <div class="ep-subtitle">${ep.subtitle}</div>
                    </div>
                </div>
            </a>` : `
            <div class="card locked">
                <div class="card-content">
                    <span class="ep-number">${displayLabel}</span>
                    <div class="ep-text">
                        <div class="ep-title">Locked</div>
                        <div class="ep-subtitle">Read previous chapters to unlock</div>
                    </div>
                </div>
            </div>`;
        cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

bookSelect.addEventListener("change", e => {
    if(window.playSound) window.playSound();
    renderEpisodes(e.target.value);
});

const saved = localStorage.getItem("lastBook") || books[0];
bookSelect.value = saved;
renderEpisodes(saved);

// Add Post-Credit Card if unlocked
const postCreditUnlocked = localStorage.getItem('unlocked:post-credit') === 'true';

if (postCreditUnlocked && book === books[books.length - 1]) { // Only show in the last book
    const pcNum = "??";
    const pcHTML = `
        <a class="card" href="javascript:void(0)" onclick="navigateWithSound('episodes/reader.html?id=post-credit')" style="border-style: dashed; opacity: 0.8;">
            <div class="card-content">
                <span class="ep-number">${pcNum}</span>
                <div class="ep-text">
                    <div class="ep-title">${postCredit.title}</div>
                    <div class="ep-subtitle">${postCredit.subtitle}</div>
                </div>
            </div>
        </a>`;
    cardsContainer.insertAdjacentHTML('beforeend', pcHTML);
}