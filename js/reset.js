window.resetMemory = function() {
    if (confirm('This will clear all progress and lock the anthology. Are you sure?')) {
        // 1. Wipe all local data
        localStorage.clear();
        sessionStorage.clear();

        // 2. Clear Cookies (for extra thoroughness)
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });

        // 3. Optional: Notify your Discord so you know they reset
        if (window.sendPrivateLog) {
            window.sendPrivateLog("🔒 **Memory Reset**: User cleared all data and logged out.", 1);
        }

        // 4. Force them back to the login page
        // replace() is better than reload() because it prevents "back button" re-entry
        window.location.replace('login.html');
    }
};