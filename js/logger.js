
// js/logger.js
window.sendPrivateLog = async function(message, isEmergency = false) {
    if (!window._secret) {
        console.error("❌ Logger Error: window._secret is missing.");
        return;
    }

    const mode = window.getLoggingMode();
    const url = window.getLogKey();
    const isPriority = (isEmergency === true || isEmergency === 1);

    if (mode === "off") return;
    if (mode === "emergency" && !isPriority) return;

    try {
        // 1. Get Device Info
        const device = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";
        const platform = navigator.platform;
        
        // 2. Get Location (with a 2-second safety timeout)
        let locationData = "Location Pending/Blocked";
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            const geoRes = await fetch("https://ipapi.co/json/", { signal: controller.signal });
            clearTimeout(timeoutId);

            if (geoRes.ok) {
                const geo = await geoRes.json();
                locationData = `${geo.city}, ${geo.region} (${geo.country_name})`;
            }
        } catch (geoErr) {
            locationData = "Location Hidden/VPN";
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
        
        console.log("🚀 Discord ping sent with data!");
    } catch (e) {
        console.error("❌ Logger Failed:", e);
    }
};