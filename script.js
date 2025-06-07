document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('acceptCookieButton');
    const yearSpan = document.getElementById('currentYear');

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function hideBanner() {
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    }

    // Check if cookies were already accepted
    if (getCookie('cookies_accepted') === 'true') {
        hideBanner();
    } else {
        // Ensure banner is visible if cookies not accepted (it should be by default via CSS)
        if (cookieBanner) cookieBanner.style.display = 'block'; // Or 'flex' or its original display type
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            hideBanner();
            let expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Cookie expires in 1 year
            // Add 'Secure' attribute if your site is served over HTTPS
            document.cookie = 'cookies_accepted=true; path=/; expires=' + expiryDate.toUTCString() + '; SameSite=Lax';
        });
    }

    // Set current year in footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});