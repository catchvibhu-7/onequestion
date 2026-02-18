(function() {
    const isGranted = localStorage.getItem('access_granted') === 'true';
    // Check if we are currently on the login page to avoid infinite loops
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!isGranted && !isLoginPage) {
        // If we are inside the /episodes/ folder, we need to go up one level
        const path = window.location.pathname;
        const prefix = path.includes('/episodes/') ? '../' : '';
        window.location.href = prefix + 'login.html';
    }
})();