function injectHelloWorldButton() {

    const platformButton = document.querySelector("#nav-uiconfigs");

    if (!platformButton) return;

    if (document.querySelector("#nav-helloworld")) return;

    const newButton = platformButton.cloneNode(true);

    newButton.id = "nav-helloworld";

    const link = newButton.querySelector("a");
    link.href = "#";

    const text = newButton.querySelector(".nav-text");
    text.innerText = "Hello World";

    link.onclick = function (e) {
        e.preventDefault();

        alert("Hello World");

        openIframePage();
    };

    platformButton.parentNode.insertBefore(newButton, platformButton.nextSibling);
}

function openIframePage() {

    let container = document.querySelector("#hello-world-container");

    if (!container) {

        container = document.createElement("div");
        container.id = "hello-world-container";

        container.style.width = "100%";
        container.style.height = "calc(100vh - 140px)";
        container.style.marginTop = "20px";

        const iframe = document.createElement("iframe");

        iframe.src = "https://www.google.com.pk";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";

        container.appendChild(iframe);

        const mainContent = document.querySelector("#content") || document.body;

        mainContent.innerHTML = "";
        mainContent.appendChild(container);
    }
}

setTimeout(injectHelloWorldButton, 2000);
