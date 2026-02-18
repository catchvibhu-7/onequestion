
window._secret = {
    // We split the URL for basic bot protection
    p1: "https://discord.com/api/webhooks/",
    p2: "1472690020463808573/",
    p3: "rChjjVTGZO7",
    p4: "-eo8-C_0L33dgFY1nueV-6L8pPoBDVkxYATA_",
    p5: "zBmVhMHdXNERJl5pz6s8",
    loggingMode: "all"
    // MODES: 
    // "all"       -> Logs everything (Home, Chapters, Decisions, Messages)
    // "emergency" -> Logs ONLY Final Decisions and Personal Messages
    // "off"       -> Silence
};

window.getLogKey = function() { 
    return window._secret.p1 + window._secret.p2 + window._secret.p3 + window._secret.p4 + window._secret.p5; 
};

window.getLoggingMode = function() { 
    return window._secret.loggingMode; 
};

console.log("✅ extra.js loaded. Mode:", window._secret.loggingMode);

