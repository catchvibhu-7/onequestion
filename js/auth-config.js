// js/auth-config.js
window._auth = {
    // Example: "MyPassword" encoded is "TXlQYXNzd29yZA=="
    MASKED_KEY: "aW1hZGV0aGlzb25seWZvcnlvdQ==", 

    check: function(input) {
        // btoa converts the input to Base64 to compare against our mask
        return btoa(input) === this.MASKED_KEY;
    }
};

// Theme Toggler for Login Page
window.toggleLoginTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
};