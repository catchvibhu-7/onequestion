/* ---------------- BLUR BLOCKS ---------------- */

function applyBlurBlocks(html) {
  return html.replace(
    /<p>:::blur<\/p>([\s\S]*?)<p>:::<\/p>/g,
    (_, content) => {
      if (!content.trim()) return ""; // 👈 ignore empty blur blocks

      return `
        <div class="blur-block" data-revealed="false">
          <div class="blurred">${content}</div>
          <button class="reveal-btn">Reveal</button>
        </div>
      `;
    }
  );
}

function enableReveal(container) {
  container.querySelectorAll(".reveal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const block = btn.closest(".blur-block");
      block.dataset.revealed = "true";
      btn.remove();
    });
  });
}



/* ---------------- HELPERS ---------------- */

function isEpisodeUnlocked(ep, fromEpisodeId) {
  if (!ep) return false;

  // Permanently unlocked
  if (localStorage.getItem(`unlocked:${ep.id}`) === "true") {
    return true;
  }

  // Normal episode
  if (!ep.locked) {
    return true;
  }

  // Contextual unlock
  return ep.unlock === fromEpisodeId;
}

/* ---------------- RESOLVE TARGET ---------------- */

const params = new URLSearchParams(window.location.search);
const episodeId = params.get("id");
const isPostCredit = episodeId === "post-credit";

const previousEpisodeId = localStorage.getItem("lastEpisode");

let episode = null;
let index = -1;

/* ---------------- POST-CREDIT HANDLING ---------------- */

if (isPostCredit) {
  if (localStorage.getItem("postCreditUnlocked") !== "true") {
    document.getElementById("content").innerHTML =
      "<h2>Page not available</h2>";
    throw new Error("Post-credit locked");
  }

  // postCredit must be defined in episodes.js
  episode = postCredit;
} else {
  index = episodes.findIndex(e => e.id === episodeId);
  episode = episodes[index];
}

/* ---------------- ACCESS GUARD ---------------- */

if (!episode) {
  document.getElementById("content").innerHTML =
    "<h2>Episode not available</h2>";
  throw new Error("Missing episode");
}

if (!isPostCredit) {
  const canAccess = isEpisodeUnlocked(episode, previousEpisodeId);

  if (!canAccess) {
    document.getElementById("content").innerHTML =
      "<h2>Episode not available</h2>";
    throw new Error("Episode locked");
  }

  // Persist permanent unlock
  if (episode.locked && episode.unlock === previousEpisodeId) {
    localStorage.setItem(`unlocked:${episode.id}`, "true");
  }
}

/* ---------------- METADATA ---------------- */

document.getElementById("title").textContent = episode.title;
document.getElementById("subtitle").textContent = episode.subtitle;

/* ---------------- LOAD CONTENT ---------------- */

fetch(`../content/${episode.file}`)
  .then(res => res.text())
  .then(md => {
    let html = marked.parse(md);
    html = applyBlurBlocks(html);

    const container = document.getElementById("content");
    container.innerHTML = html;

    enableReveal(container);

    // Add post-credit link at end of finale
    //if (!isPostCredit && episode.id === "finale") {
      //const link = document.createElement("a");
      //link.href = "reader.html?id=post-credit";
      //link.className = "cta-btn";
     // link.textContent = "After the Credits →";
     // container.appendChild(link);
    //}
  });

/* ---------------- SAVE PROGRESS ---------------- */

if (!isPostCredit) {
  localStorage.setItem("lastEpisode", episode.id);

  // 🎬 Unlock post-credit after finale
  if (episode.id === "finale") {
    localStorage.setItem("postCreditUnlocked", "true");
  }
}

/* ---------------- NAVIGATION ---------------- */

const prevLink = document.getElementById("prev");
const nextLink = document.getElementById("next");

if (isPostCredit) {
  // No navigation on post-credit
  prevLink.style.display = "none";
  nextLink.style.display = "none";
} else if (episode.id === "finale") {
  // Finale: replace Next with Post-Credit
  prevLink.style.visibility = "visible";

  prevLink.href = `reader.html?id=${episodes[index - 1].id}`;

  nextLink.textContent = "Post Credits →";
  nextLink.href = "reader.html?id=post-credit";
} else {
  const prev = episodes[index - 1];
  const next = episodes[index + 1];

  // Previous
  if (isEpisodeUnlocked(prev, episode.id)) {
    prevLink.href = `reader.html?id=${prev.id}`;
    prevLink.style.visibility = "visible";
  } else {
    prevLink.style.visibility = "hidden";
    prevLink.removeAttribute("href");
  }

  // Next
  if (isEpisodeUnlocked(next, episode.id)) {
    nextLink.textContent = "Next →";
    nextLink.href = `reader.html?id=${next.id}`;
    nextLink.style.visibility = "visible";
  } else {
    nextLink.style.visibility = "hidden";
    nextLink.removeAttribute("href");
  }
}


/* ---------------- BREADCRUMBS ---------------- */

document.getElementById("breadcrumb-current").textContent =
  isPostCredit ? postCredit.title : episode.title;

document.getElementById("breadcrumb-book").textContent =
  isPostCredit ? "After the Credits" : episode.book;
