function injectHelloWorldButton() {

    const platformButton = document.querySelector("#nav-uiconfigs");
    if (!platformButton) return;

    if (document.querySelector("#nav-helloworld")) return;

    const newButton = platformButton.cloneNode(true);

    newButton.id = "nav-helloworld";

    const link = newButton.querySelector("a");
    const text = newButton.querySelector(".nav-text");

    text.innerText = "Custom Button";
    link.href = "#";

    link.onclick = function (e) {

        e.preventDefault();

        alert("Hello World");

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

    if (header) header.innerText = "Custom Button";
}

function openIframePage() {

    let container = document.querySelector("#hello-world-container");

    if (!container) {

        container = document.createElement("div");
        container.id = "hello-world-container";

        container.style.width = "100%";
        container.style.height = "700px";

        const iframe = document.createElement("iframe");

        // iframe.src = "https://example.com";
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

setTimeout(injectHelloWorldButton, 2000);
