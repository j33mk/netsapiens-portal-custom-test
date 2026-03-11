function addCustomPortalButton() {

    const platformTile = [...document.querySelectorAll("div")]
        .find(el => el.innerText.trim() === "Platform Settings");

    if (!platformTile) {
        console.log("Platform Settings tile not found");
        return;
    }

    const tile = platformTile.closest("li, div");

    if (!tile) return;

    const newTile = tile.cloneNode(true);

    newTile.innerHTML = newTile.innerHTML
        .replace("Platform Settings", "Hello World")
        .replace("fa-wrench", "fa-star");

    newTile.onclick = function () {
        alert("Hello World!");
    };

    tile.parentNode.insertBefore(newTile, tile.nextSibling);
}

setTimeout(addCustomPortalButton, 3000);
