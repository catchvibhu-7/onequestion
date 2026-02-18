/**
 * js/reader.js
 * Reading logic, progress saving, finale visuals, and interactive proposal logic.
 */
window.onload = () => {
    window.scrollTo(0, 0);
};

function applyBlurBlocks(html) {
    const params = new URLSearchParams(window.location.search);
    const epId = params.get("id");

    return html.replace(/<p>:::blur<\/p>([\s\S]*?)<p>:::<\/p>/g, (_, content) => {
        return `
            <div class="blur-block" data-revealed="false" onclick="handleReveal(this, '${epId}')">
                <div class="blurred">${content}</div>
            </div>`;
    });
}

window.handleReveal = function (el, id) {
    if (el.dataset.revealed === "true") return;
    el.dataset.revealed = "true";
    if (id === "finale") {
        if (window.playFinaleSound) window.playFinaleSound();
        if (window.triggerFlowerShower) window.triggerFlowerShower();
    } else {
        if (window.playSound) window.playSound();
    }
};

window.handleDecision = function(choice) {
    // 1. Log the choice (Explicitly passing true to bypass emergency filters)
    try {
        if (typeof window.sendPrivateLog === "function") {
            window.sendPrivateLog(`🎯 **Decision Made**: ${choice.toUpperCase()}`, 1);
        }
    } catch (e) {
        console.warn("Log failed, but continuing story...");
    }

    // 2. Visual Logic
    const decisionArea = document.querySelector('.decision-buttons');
    if (decisionArea) decisionArea.style.display = 'none';

    if (choice === 'yes') {
        const yesBlock = document.getElementById('yes-response');
        if (yesBlock) yesBlock.classList.add('revealed');
        localStorage.setItem('celebration_active', 'true');
        
        if (window.triggerFireworks) window.triggerFireworks(8000); 
        // Happy Transformation
        showFinalNoteHook('happy', 8000);
        // 3. Show Message Box after a delay
        setTimeout(() => {
            const messageSection = document.createElement('div');
            messageSection.id = "final-message-wrap";
            messageSection.className = "message-area";
            messageSection.innerHTML = `
                <p>Do you want to share your feelings over a message? (Calling is still a better option!)</p>
                <textarea id="user-note" class="message-input" placeholder="Type your message here..."></textarea>
                <button class="cta-btn" onclick="sendFinalNote()" style="display: flex; align-items: center; gap: 8px; margin: 0 auto;">
                    <span>Send Message</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </button>
            `;
            const contentContainer = document.getElementById('content');
            if (contentContainer) {
                contentContainer.appendChild(messageSection);
                messageSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 8000); 
        
    } else {
        const noBlock = document.getElementById('no-response');
        if (noBlock) noBlock.classList.add('revealed');
        localStorage.setItem('celebration_active', 'false');

        // Log the "No" path as an Emergency priority as well
        if (typeof window.sendPrivateLog === "function") {
            // Inside window.handleDecision:
window.sendPrivateLog(`🎯 **Decision Made**: ${choice.toUpperCase()}`, 1);
        }
        // Sad Transformation
        // No path: Faster transition (3 seconds) to avoid awkward silence
        showFinalNoteHook('sad', 3000);
    }
};


function showFinalNoteHook(type, delay) {
    setTimeout(() => {
        const nextLink = document.getElementById("next");
        if (!nextLink) return;

        // 1. Update Button Text & Style
        const span = nextLink.querySelector("span");
        if (type === 'happy') {
            span.textContent = "The Final Note.";
            nextLink.className = "cta-btn hook-happy";
        } else {
            span.textContent = "One last Note.";
            nextLink.className = "cta-btn hook-sad";
        }

        nextLink.style.display = "inline-flex";
        nextLink.style.marginLeft = "auto";
        nextLink.onclick = () => {
            localStorage.setItem("unlocked:post-credit", "true");
            window.navigateWithSound("reader.html?id=post-credit");
        };

        

    }, delay);
}
// The function to send the note to Discord
/**
 * Updated to also bypass Emergency Mode
 */
window.sendFinalNote = function() {
    const note = document.getElementById('user-note').value;
    if (!note.trim()) return;

    // 1. Send to Discord - PASS TRUE HERE
    if (typeof window.sendPrivateLog === "function") {
        // Inside window.sendFinalNote:
window.sendPrivateLog(`💌 **PERSONAL MESSAGE**: \n> ${note}`, 1);
    }

    // 2. Trigger Mail Animation (Using your SVG logic)
    const mail = document.createElement('div');
    mail.className = 'flying-mail';
    mail.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a6705d" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
    document.body.appendChild(mail);

    // 3. Reveal the Final Seal
    const wrap = document.getElementById('final-message-wrap');
    if (wrap) wrap.style.animation = "fadeOutShrink 0.8s forwards";
    
    setTimeout(() => {
        if (wrap) wrap.remove();
        mail.remove();

        const thanks = document.createElement('div');
        thanks.style.textAlign = 'center';
        thanks.style.marginTop = '40px';
        thanks.innerHTML = `
            <p style="font-style: italic; margin-bottom: 10px; opacity: 0.8;">Message sent.</p>
            <h2 class="shimmer-active" style="font-size: 1.5rem; color: var(--accent);">
                "One Question, Answered." 
                <svg class="title-heart" viewBox="0 0 24 24" style="width: 0.8em; height: 0.8em; vertical-align: middle; fill: var(--accent);">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </h2>
        `;
        document.getElementById('content').appendChild(thanks);
    }, 1500);
};



function triggerConfetti() {
    const colors = ["#a6705d", "#cf9c8a", "#f4d7d0"];
    for (let i = 0; i < 100; i++) {
        const c = document.createElement('div');
        c.className = 'confetti';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDuration = (Math.random() * 2 + 1) + 's';
        c.style.opacity = Math.random();
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3000);
    }
}

window.playFinaleSound = function () {
    if (localStorage.getItem("muted") === "true") return;
    const audio = new Audio("../assets/audio/finale-swell.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
};

function refineImages(container) {
    container.querySelectorAll("img").forEach((img) => {
        if (img.alt.toLowerCase().includes("wide")) {
            img.style.width = "100vw";
            img.style.maxWidth = "none";
            img.style.marginLeft = "calc(-50vw + 50%)";
            img.style.borderRadius = "0";
        }
    });
}

/* ---------------- Initialization ---------------- */

const params = new URLSearchParams(window.location.search);
const epId = params.get("id") || "ep0"; // Default to ep0 if missing
let ep = episodes.find((e) => e.id === epId) || (epId === "post-credit" ? (typeof postCredit !== 'undefined' ? postCredit : null) : null);
let idx = episodes.findIndex((e) => e.id === epId);

// 1. Log Chapter Immediately
if (ep && typeof window.sendPrivateLog === "function") {
    window.sendPrivateLog(`📖 **Reading Chapter**: ${epId} (${ep.title})`);
}

if (ep) {
    document.getElementById("title").textContent = ep.title;
    document.getElementById("subtitle").textContent = ep.subtitle;
    document.getElementById("breadcrumb-current").textContent = ep.title;
    document.getElementById("breadcrumb-book").textContent = ep.book || "Extra";

    fetch(`../content/${ep.file}`)
        .then((res) => res.text())
        .then((md) => {
            let html = marked.parse(md);

            if (epId === "finale") {
                document.body.classList.add("finale-mode");
                document.documentElement.style.setProperty("--accent", "#a6705d");
            }
            if (epId === "post-credit") {
                document.body.classList.add("confession-mode");
                const controls = document.querySelector(".controls-container");
                if (controls) controls.style.display = "none";
                if (localStorage.getItem('celebration_active') === 'true') {
                    if (window.triggerFireworks) window.triggerFireworks(20000); 
                    if (window.triggerFlowerShower) window.triggerFlowerShower();
                }
            }

            html = applyBlurBlocks(html);
            const container = document.getElementById("content");
            container.innerHTML = html;
            refineImages(container);

            localStorage.setItem(`read:${epId}`, "true");
            localStorage.setItem("lastEpisode", epId);
        });
}

/* ---------------- Navigation Logic ---------------- */
const prevLink = document.getElementById("prev");
const nextLink = document.getElementById("next");
const backLink = document.getElementById("backBtn");

if (epId === "post-credit") {
    if (backLink) backLink.style.display = "none";
    if (prevLink) {
        prevLink.style.display = "inline-flex";
        prevLink.querySelector("span").textContent = "Finale";
        prevLink.onclick = () => window.navigateWithSound("reader.html?id=finale");
    }
    if (nextLink) {
        nextLink.style.display = "inline-flex";
        nextLink.style.marginLeft = "auto";
        nextLink.querySelector("span").textContent = "Home";
        nextLink.onclick = () => window.navigateWithSound("../index.html");
    }
} else {
    if (idx === 0) {
        if (backLink) {
            backLink.style.display = "inline-flex";
            backLink.onclick = () => window.navigateWithSound("../index.html");
        }
        if (prevLink) prevLink.style.display = "none";
    } else if (idx > 0) {
        if (backLink) backLink.style.display = "none";
        if (prevLink) {
            prevLink.style.display = "inline-flex";
            prevLink.onclick = () => window.navigateWithSound(`reader.html?id=${episodes[idx - 1].id}`);
        }
    }

    if (idx < episodes.length - 1 && idx !== -1) {
        if (nextLink) {
            nextLink.style.display = "inline-flex";
            nextLink.style.marginLeft = "auto";
            nextLink.onclick = () => window.navigateWithSound(`reader.html?id=${episodes[idx + 1].id}`);
        }
    } else if (epId === "finale") {
        if (nextLink) {
            nextLink.style.display = "inline-flex";
            nextLink.style.marginLeft = "auto";
            nextLink.querySelector("span").textContent = "Credits";
            nextLink.onclick = () => {
                localStorage.setItem("unlocked:post-credit", "true");
                window.navigateWithSound("reader.html?id=post-credit");
            };
        }
    } else {
        if (nextLink) nextLink.style.display = "none";
    }
}

window.triggerFlowerShower = function () {
    const container = document.body;
    const colors = ["#a6705d", "#cf9c8a", "#f8d1d7"];
    for (let i = 0; i < 60; i++) {
        const petal = document.createElement("div");
        petal.className = "petal";
        petal.style.left = Math.random() * 100 + "vw";
        petal.style.animationDuration = Math.random() * 3 + 4 + "s";
        petal.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(petal);
        setTimeout(() => petal.remove(), 7000);
    }
};

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    switch (e.key) {
        case 'ArrowRight':
            const n = document.getElementById("next");
            if (n && n.style.display !== "none") n.click();
            break;
        case 'ArrowLeft':
            const p = document.getElementById("prev");
            const b = document.getElementById("backBtn");
            if (p && p.style.display !== "none") p.click();
            else if (b && b.style.display !== "none") b.click();
            break;
        case 'Escape':
            window.navigateWithSound("../index.html");
            break;
    }
});