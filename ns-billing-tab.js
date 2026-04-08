// Helper function to decode JWT payload (no library needed)
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to decode JWT:', e);
        return null;
    }
}

// Main function with role check
function injectHelloWorldButton() {
    // ====================== ROLE CHECK ======================
    let jwt = window.ns_t;                    // Primary location as you mentioned
    if (!jwt && window.localStorage) {
        jwt = localStorage.getItem('ns_t');   // Fallback
    }

    if (!jwt) {
        console.warn('Netsapiens JWT (ns_t) not found - button blocked');
        return;
    }

    const payload = decodeJwt(jwt);
    if (!payload) {
        console.warn('Could not decode JWT - button blocked');
        return;
    }

    const userScope = (payload.user_scope || '').toLowerCase().trim();

    // Allowed scopes - adjust as needed
    const allowedScopes = ['super user', 'superuser', 'reseller'];

    if (!allowedScopes.some(scope => userScope.includes(scope))) {
        console.log(`Billing button blocked - user_scope is "${payload.user_scope}"`);
        return;
    }

    console.log(`Billing button enabled for user_scope: ${payload.user_scope}`);
    // ====================== END ROLE CHECK ======================

    const platformButton = document.querySelector("#nav-uiconfigs");
    if (!platformButton) return;

    if (document.querySelector("#nav-helloworld")) return;

    const newButton = platformButton.cloneNode(true);
    newButton.id = "nav-helloworld";

    const link = newButton.querySelector("a");
    const text = newButton.querySelector(".nav-text");

    text.innerText = "Billing";
    link.href = "#";

    link.onclick = function (e) {
        e.preventDefault();
        // alert("Hello World");   // ← remove or comment out in production

        activateButton(newButton);
        openIframePage();
    };

    platformButton.after(newButton);
}

function activateButton(button) {
    document.querySelectorAll("#nav-buttons li")
        .forEach(li => li.classList.remove("nav-link-current"));

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

// Run after a short delay to ensure the page (and ns_t) is fully loaded
setTimeout(injectHelloWorldButton, 1500);
