/**
 * js/indexloader.js
 * Injects metadata, handles the Hero Glass stage, Story Complete badge, and About toggle.
 */

// 1. Force Scroll Management
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener("DOMContentLoaded", () => {
    
    const hasSaidYes = localStorage.getItem("celebration_active") === "true";

    // 2. Scroll to top logic with a slight delay for browser stability
    if (hasSaidYes) {
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }, 100);
    }
    
    // 3. Safety Check
    if (typeof activeSeries === "undefined" || !activeSeries) return;

    const heroStage = document.getElementById("hero-glass-stage");
    const isFinished = localStorage.getItem("read:finale") === "true";
    const seriesTitleEl = document.getElementById("seriesTitle");

    // 4. Inject Metadata
    document.title = activeSeries.title;
    if (seriesTitleEl && !hasSaidYes) {
        seriesTitleEl.innerHTML = activeSeries.title.replace(",", ",<br>");
    }

    const metadataMap = {
        seriesWarning: activeSeries.warning,
        seriesGenre: activeSeries.genre,
        seriesCast: activeSeries.cast,
        seriesAuthor: activeSeries.author
    };

    Object.entries(metadataMap).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    });

    // 5. Hero Visuals & Glass Stage Logic
    if (heroStage) {
        if (isFinished) heroStage.classList.add("completed");

        const lastEpId = localStorage.getItem("lastEpisode");
        let imageUrl = activeSeries.heroImage;

        if (lastEpId && typeof episodes !== "undefined") {
            const currentEp = episodes.find((e) => e.id === lastEpId);
            if (currentEp && currentEp.image) imageUrl = currentEp.image;
        }

        if (imageUrl) {
            heroStage.style.backgroundImage = `
                linear-gradient(to bottom, 
                rgba(0,0,0,0) 0%, 
                rgba(0,0,0,0.2) 50%, 
                rgba(0,0,0,0.8) 100%), 
                url('${imageUrl}')
            `;
            heroStage.style.backgroundSize = "cover";
            heroStage.style.backgroundPosition = "center 20%";
            heroStage.style.backgroundRepeat = "no-repeat";
        } else {
            heroStage.style.background = `linear-gradient(135deg, var(--card-bg) 0%, var(--border) 100%)`;
            heroStage.style.setProperty("--mask-opacity", "0");
        }
    }

    // 6. Story Complete Badge
    if (isFinished) {
        const starSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6;"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"></path></svg>`;
        const badgeHtml = `<span class="complete-badge">Story Complete ${starSvg}</span>`;
        const actionArea = document.getElementById("action-area");
        if (actionArea) {
            actionArea.insertAdjacentHTML("beforeend", badgeHtml);
        }
    }

    // 7. 'About' Section with Toggle
    const container = document.getElementById("aboutContent");
    if (container && activeSeries.aboutFile) {
        fetch(`content/${activeSeries.aboutFile}`)
            .then((res) => res.text())
            .then((md) => {
                container.innerHTML = typeof marked !== "undefined" ? marked.parse(md) : md;
                setTimeout(() => {
                    if (container.scrollHeight > 120) {
                        const btn = document.createElement("div");
                        btn.className = "read-more-btn";
                        const downSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px; vertical-align:middle;"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
                        const upSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:5px; vertical-align:middle;"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
                        btn.innerHTML = `<span>Read More</span>${downSvg}`;
                        btn.onclick = () => {
                            const isExpanded = container.classList.toggle("expanded");
                            btn.innerHTML = isExpanded ? `<span>Read Less</span>${upSvg}` : `<span>Read More</span>${downSvg}`;
                            if (window.playSound) window.playSound();
                        };
                        container.after(btn);
                    }
                }, 100);
            })
            .catch(() => {
                container.innerHTML = "<em>About content could not be loaded.</em>";
            });
    }

    // 8. Celebration Trigger (Longer 25s version for the Home reveal)
    if (hasSaidYes && window.triggerFireworks) {
        window.triggerFireworks(25000);
    }

    // 9. THE "ONE ANSWER" TRANSFORMATION
    // We check if she finished the finale AND what her specific answer was
    const finaleFinished = localStorage.getItem("read:finale") === "true";
    const postCreditFinished = localStorage.getItem("read:post-credit") === "true";

    if (seriesTitleEl && (hasSaidYes || postCreditFinished)) {
        
        // We look specifically for the Yes flag to decide which heart to show
        if (hasSaidYes) {
            seriesTitleEl.innerHTML = `Nine Years,<br>One Question, Answered. <svg class="title-heart" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
        } else {
            // If post-credit is read but hasSaidYes is false, it's the broken heart path
            seriesTitleEl.innerHTML = `Nine Years,<br>One Question, Answered. <svg class="title-heart broken" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c.94 0 1.83.24 2.61.66l2.1 4.54-2.11 4.45 2.11 4.45-1.21 4.25zM16.5 3c1.74 0 3.41.81 4.5 2.09C22 6.42 22 8.5 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35l1.21-4.25-2.11-4.45 2.11-4.45-2.1-4.54c.4-.13.82-.2 1.25-.21.55-.01 1.09.08 1.64.21z"/></svg>`;
        }
        
        seriesTitleEl.classList.add("shimmer-active");
        seriesTitleEl.style.fontSize = "clamp(1.5rem, 8vw, 2.5rem)";
    }
});