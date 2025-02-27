function handleKeyPress(event) {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (validKeys.includes(event.key)) {
        player.move(event.key);    // 🎮 Gimli beveger seg
        checkCell();               // 🏹 Sjekk hva som finnes på cellen (skatt, Gollum, Balrog)
        moveBalrog();              // 🔥 Balrog beveger seg tilfeldig
        moveGollum();              // 🐟 Gollum beveger seg mot spilleren
        renderBoard();             // 🖼️ RENDER: Oppdater brettet fysisk
        updatePlayerStats();       // 🔄 Oppdater spillerstatus
    }
}


// --- Initial Setup ---
// 🚀 Start spillet første gang
startGame();
updatePlayerStats();
function startGame() {
    player.x = 0;
    player.y = 0;
    player.inventory = [];
    player.moves = 0;  // 🔄 Tilbakestill trekk-teller
    generateBoard();
    renderBoard();
    updatePlayerStats();

    // ✅ Fjern event-listener først for å unngå flere koblinger
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

