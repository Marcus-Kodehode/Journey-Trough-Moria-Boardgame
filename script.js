// 🎵 Lydfiler
const sounds = {
    start: new Audio('sounds/chosendeath.mp3'),
    gollum1: new Audio('sounds/turnaround.mp3'),
    gollum2: new Audio('sounds/nofriends.mp3'),
    balrog: new Audio('sounds/balrog.mp3'),
    victory: new Audio('sounds/gimli.mp3')
};

// 🎮 Hindrer bevegelse før start
let gameStarted = false;

// 🔘 Start-knapp funksjonalitet
document.getElementById('startButton').addEventListener('click', function() {
    gameStarted = true;  // 🏁 Spillet er nå aktivt
    this.style.display = "none";  // 🔽 Skjul start-knappen
    sounds.start.play();  // 🎵 Spill startlyd én gang
    startGame();  // 🚀 Start spillet når knappen trykkes
});

// 🎮 Oppdater bevegelsesfunksjonen slik at den sjekker `gameStarted`
function handleKeyPress(event) {
    if (!gameStarted) return; // 🚫 Ingen bevegelse før start

    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (validKeys.includes(event.key)) {
        player.move(event.key);
        moveBalrog();
        moveGollum();  // ✅ Nå beveger Gollum seg også
        checkCell();
        renderBoard();
        updatePlayerStats();        
    }
}

// 🔄 Sørg for at `handleKeyPress` kun fungerer etter start
document.removeEventListener('keydown', handleKeyPress);
document.addEventListener('keydown', handleKeyPress);

// 🎮 Start spillfunksjon
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