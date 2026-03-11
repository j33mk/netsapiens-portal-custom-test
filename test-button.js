document.addEventListener("DOMContentLoaded", function () {
    const btn = document.createElement("button");
    btn.innerText = "Hello World";

    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.padding = "10px 20px";

    btn.onclick = function () {
        alert("Hello World");
    };

    document.body.appendChild(btn);
});
