function addHelloWorldButton() {

    if (document.getElementById("helloWorldBtn")) return;

    const btn = document.createElement("button");
    btn.id = "helloWorldBtn";
    btn.className = "hello-world-btn";
    btn.innerText = "Hello World";

    btn.onclick = function () {
        alert("Hello World!");
    };

    document.body.appendChild(btn);
}

window.addEventListener("load", function () {
    setTimeout(addHelloWorldButton, 2000);
});
