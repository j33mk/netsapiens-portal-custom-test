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

function shouldShowBillingButton() {
    let jwt = window.ns_t;
    if (!jwt && localStorage) jwt = localStorage.getItem('ns_t');

    if (!jwt) {
        console.warn('ns_t JWT not found');
        return false;
    }

    const payload = decodeJwt(jwt);
    if (!payload || !payload.user_scope) {
        console.warn('Invalid JWT payload or no user_scope');
        return false;
    }

    const scope = (payload.user_scope || '').toLowerCase().trim();
    const allowed = ['super user', 'superuser', 'reseller'];
    const isAllowed = allowed.some(a => scope.includes(a));

    console.log(`User scope: "${payload.user_scope}" → Billing button ${isAllowed ? 'ENABLED' : 'BLOCKED'}`);

    return isAllowed;
}

// Main injection function
function injectHelloWorldButton() {
    if (!shouldShowBillingButton()) return;

    // Prevent duplicate button
    if (document.querySelector("#nav-helloworld")) return;

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

function activateButton(button) {
    document.querySelectorAll("#nav-buttons li").forEach(li => 
        li.classList.remove("nav-link-current")
    );
    button.classList.add("nav-link-current");

    const header = document.querySelector(".page-title, .header-title");
    if (header) header.innerText = "Billing";
}

function openIframePage() {
    let container = document.querySelector("#hello-world-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "hello-world-container";
        container.style.width = "100%";
        container.style.height = "700px";

        const iframe = document.createElement("iframe");
        iframe.src = "https://billing.sbvoice.com.au";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";

        container.appendChild(iframe);

        const content = document.querySelector("#content") || document.body;
        content.innerHTML = "";
        content.appendChild(container);
    }
}

// Run on initial load
setTimeout(injectHelloWorldButton, 1800);

// Optional: Re-check when user switches tabs/windows (extra safety)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        setTimeout(injectHelloWorldButton, 800);
    }
});
