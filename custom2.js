function injectHelloWorldButton() {

    const platformButton = document.querySelector("#nav-uiconfigs");

    if (!platformButton) {
        console.log("Platform Settings button not found");
        return;
    }

    if (document.querySelector("#nav-helloworld")) return;

    const newButton = platformButton.cloneNode(true);

    newButton.id = "nav-helloworld";

    const link = newButton.querySelector("a");
    link.href = "#";

    const text = newButton.querySelector(".nav-text");
    text.innerText = "Hello World";

    link.onclick = function (e) {
        e.preventDefault();
        alert("Hello World!");
    };

    platformButton.parentNode.insertBefore(newButton, platformButton.nextSibling);
}

setTimeout(injectHelloWorldButton, 2000);
