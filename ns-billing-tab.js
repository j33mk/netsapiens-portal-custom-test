// Helper to decode JWT
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT decode failed:', e);
        return null;
    }
}

function getCurrentUserScope() {
    let jwt = window.ns_t || (localStorage && localStorage.getItem('ns_t'));
    if (!jwt) return null;
    const payload = decodeJwt(jwt);
    return payload ? (payload.user_scope || '').toLowerCase().trim() : null;
}

// Check if we should force hard refresh (only once after possible login)
function shouldForceHardRefresh() {
    const currentScope = getCurrentUserScope();
    if (!currentScope) return false;

    // You can store the previous scope in sessionStorage to detect changes
    const previousScope = sessionStorage.getItem('lastKnownUserScope');

    // If scope changed (or first time after login), force hard refresh once
    if (!previousScope || previousScope !== currentScope) {
        sessionStorage.setItem('lastKnownUserScope', currentScope);
        console.log(`Scope changed from "${previousScope}" to "${currentScope}" → forcing hard refresh`);
        return true;
    }
    return false;
}

// ====================== FORCE HARD REFRESH LOGIC ======================
if (shouldForceHardRefresh()) {
    // Force hard refresh (bypasses cache)
    setTimeout(() => {
        window.location.reload(true);   // true = force from server (works in most browsers)
        // Alternative (more reliable cache bust): 
        // window.location.href = window.location.href.split('?')[0] + '?refresh=' + Date.now();
    }, 800);   // Small delay so JWT is fully set
    // Stop further execution
} 
// =====================================================================

// If no hard refresh needed, proceed with normal button management
function shouldShowBillingButton() {
    const scope = getCurrentUserScope();
    if (!scope) return false;
    // const allowed = ['aa', 'bb', 'cc'];
    const allowed = ['super user', 'superuser', 'reseller'];
    return allowed.some(a => scope.includes(a));
}

function removeBillingButton() {
    const btn = document.querySelector("#nav-helloworld");
    if (btn) btn.remove();
}

function manageBillingButton() {
    if (shouldShowBillingButton()) {
        if (!document.querySelector("#nav-helloworld")) {
            const platformButton = document.querySelector("#nav-uiconfigs");
            if (!platformButton) return;

            const newButton = platformButton.cloneNode(true);
            newButton.id = "nav-helloworld";

            const link = newButton.querySelector("a");
            const text = newButton.querySelector(".nav-text");

            text.innerText = "Billing";
            link.href = "#";

            link.onclick = function (e) {
                e.preventDefault();
                activateButton(newButton);
                openIframePage();
            };

            platformButton.after(newButton);
        }
    } else {
        removeBillingButton();
    }
}

function activateButton(button) { /* your existing code */ }

function openIframePage() {
    if (!shouldShowBillingButton()) {
        alert("Access denied: Insufficient privileges.");
        return;
    }
    /* your existing iframe code */
}

// Run button management
setTimeout(manageBillingButton, 1500);
setTimeout(manageBillingButton, 4000);

// Additional listeners for better reactivity
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') setTimeout(manageBillingButton, 800);
});
window.addEventListener('popstate', manageBillingButton);
