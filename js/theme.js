/**
 * Global Controller: Theme, Font, Audio
 */

// 1. Dynamic Path Detection
const isInSubfolder = window.location.pathname.includes('/episodes/');
const soundFile = isInSubfolder ? '../assets/audio/page-turn.mp3' : 'assets/audio/page-turn.mp3';
const sfx = new Audio(soundFile);
sfx.volume = 0.3;

// 2. Global Audio Functions
window.playSound = function() {
    if (localStorage.getItem('muted') === 'true') return;
    sfx.currentTime = 0;
    sfx.play().catch(() => { console.log("Audio interaction required"); });
};

window.navigateWithSound = function(url) {
    const isMuted = localStorage.getItem('muted') === 'true';
    if (isMuted) {
        window.location.href = url;
    } else {
        window.playSound();
        setTimeout(() => { window.location.href = url; }, 150);
    }
};

// 3. UI Injection
function initGlobalControls() {
    // Prevent double injection
    if (document.querySelector('.controls-container')) return;

    const controls = `
    
    <div class="controls-container">
         <button class="control-btn" id="confessBtn" title="Confession Mode">✍️</button>
        <button class="control-btn" id="muteBtn" title="Mute">🔊</button>
        <button class="control-btn" id="fontBtn" title="Font Size">A</button>
        <button class="control-btn" id="themeBtn" title="Theme">
            <svg id="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            <svg id="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', controls);

    const muteBtn = document.getElementById('muteBtn');
    const fontBtn = document.getElementById('fontBtn');
    const themeBtn = document.getElementById('themeBtn');
    
    // Add the logic after the HTML is injected
const confessBtn = document.getElementById('confessBtn');

let isConfession = localStorage.getItem('confessionMode') === 'true';
const updateConfessionUI = () => {
    document.body.classList.toggle('confession-mode', isConfession);
    confessBtn.style.borderColor = isConfession ? 'var(--accent)' : 'var(--border)';
    confessBtn.style.opacity = isConfession ? '1' : '0.6';
};

updateConfessionUI();

confessBtn.onclick = () => {
    isConfession = !isConfession;
    localStorage.setItem('confessionMode', isConfession);
    updateConfessionUI();
    if(window.playSound) window.playSound();
};

   /* ---------------- js/theme.js: Mute by Default Update ---------------- */

// --- Mute Logic ---
// Check if a setting exists; if not, default to 'true' (muted)
if (localStorage.getItem('muted') === null) {
    localStorage.setItem('muted', 'true');
}

let muted = localStorage.getItem('muted') === 'true';

const updateMuteUI = () => { 
    muteBtn.textContent = muted ? '🔇' : '🔊'; 
};

updateMuteUI();

muteBtn.onclick = () => {
    muted = !muted;
    localStorage.setItem('muted', muted);
    updateMuteUI();
    // Only play sound if the user is unmuting
    if(!muted && window.playSound) window.playSound();
};

    // --- Font Logic ---
    const sizes = ['standard', 'large', 'xl'];
    const updateFontUI = (s) => {
        document.body.setAttribute('data-size', s);
        fontBtn.textContent = s === 'standard' ? 'A' : (s === 'large' ? 'A+' : 'A++');
    };
    updateFontUI(localStorage.getItem('fontSize') || 'standard');
    fontBtn.onclick = () => {
        let cur = localStorage.getItem('fontSize') || 'standard';
        let next = sizes[(sizes.indexOf(cur) + 1) % sizes.length];
        localStorage.setItem('fontSize', next);
        updateFontUI(next);
        window.playSound();
    };

    // --- Theme Logic ---
    const updateThemeUI = (t) => {
        document.documentElement.setAttribute('data-theme', t);
        document.getElementById('sun').style.display = t === 'dark' ? 'block' : 'none';
        document.getElementById('moon').style.display = t === 'dark' ? 'none' : 'block';
    };
    updateThemeUI(localStorage.getItem('theme') || 'light');
    themeBtn.onclick = () => {
        let next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        updateThemeUI(next);
        window.playSound();
    };
}

// Run injection
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalControls);
} else {
    initGlobalControls();
}
window.triggerFireworks = function(duration = 8000) {
    const canvas = document.createElement('div');
    canvas.id = "fireworks-overlay";
    document.body.appendChild(canvas);

    const interval = setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'firework-heart';
        
        heart.style.left = Math.random() * 90 + 5 + 'vw';
        heart.style.top = Math.random() * 60 + 10 + 'vh';
        
        // Randomize initial rotation for a natural feel
        const rotation = (Math.random() - 0.5) * 40;
        heart.style.setProperty('--init-rot', `${rotation}deg`);
        
        canvas.appendChild(heart);
        setTimeout(() => heart.remove(), 2500);
    }, 250);

    setTimeout(() => {
        clearInterval(interval);
        if (canvas) canvas.remove();
        if (duration > 50000) localStorage.removeItem('celebration_active');
    }, duration);
};
/*window.triggerFireworks = function(duration = 8000) {
    const canvas = document.createElement('div');
    canvas.id = "fireworks-overlay";
    document.body.appendChild(canvas);

    // High-density burst logic
    const interval = setInterval(() => {
        const burst = document.createElement('div');
        burst.className = 'firework-burst';
        burst.style.left = Math.random() * 90 + 5 + 'vw';
        burst.style.top = Math.random() * 60 + 10 + 'vh';
        
        // Randomize sizes for depth
        const size = Math.random() * 4 + 2 + 'px';
        burst.style.width = size;
        burst.style.height = size;
        
        canvas.appendChild(burst);
        setTimeout(() => burst.remove(), 2000);
    }, 300);

    setTimeout(() => {
        clearInterval(interval);
        if (canvas) canvas.remove();
        // Clear flag after the "Grand Finale" on Home page
        if (duration > 10000) localStorage.removeItem('celebration_active');
    }, duration);
};*/
