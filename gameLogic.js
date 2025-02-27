// =======================================================
// 🏹 gameLogic.js - Spilllogikk, inventory, vinn/tap, kamp
// =======================================================

// ========================================
// 📊 1. Oppdater spillerstatistikk (helse, skatter, trekk)
// ========================================
function updatePlayerStats() {
    const playerStats = document.getElementById('playerStats');
    playerStats.innerHTML = `
        🩸 Health: ${player.health} | 
        ✨ Treasures Collected: ${player.inventory.length}/${treasures.length} | 
        🚶‍♂️ Moves: ${player.moves} 
    `;
}

// ========================================
// 🧭 2. Sjekk innhold i cellen spilleren flytter til
// ========================================
function checkCell() {
    const cellContent = gameBoard[player.x][player.y];

    if (treasures.includes(cellContent)) {
        player.inventory.push(cellContent);
        gameBoard[player.x][player.y] = '';
        showTreasurePopup(cellContent);
        updatePlayerStats();
        if (cellContent === '🔥 Balrog') {
            gameOver(false, "balrog"); // 💀 Bruker spesialtekst for Balrog
        }
        
        if (player.inventory.length === treasures.length) gameOver(true);

    } else if (cellContent === '🔥 Balrog') {
        gameOver(false); // 💀 Game Over ved Balrog
    } else if (cellContent === '🐟 Gollum') {
        fightGollum();   // ⚔️ Kjør Gollum-logikken
    }
}


// ========================================
// ⚔️ 3. Kampsystem: Gollum Encounter
// ========================================
function fightGollum() {
    const popup = document.getElementById('gamePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    const popupButton = popup.querySelector('button');
    const closeIcon = document.getElementById('popupCloseIcon');

    player.gollumEncounters++;

    if (player.gollumEncounters === 1) {
        // 🐟 Første møte (advarsel med X for lukking)
        popupTitle.innerText = "🐟 Gollum Sighting!";
        popupMessage.innerText = `“Hisss... Who goes there? A dwarf? My preciousss smells you!”\n\n⚠️ “We watches you... One more time and we takes it!”\n💡 *Be warned: Another encounter will be your doom!*`;
        popupButton.style.display = "none";           // 🚫 Ingen restart-knapp
        closeIcon.style.display = "block";            // ✅ Vis X for å lukke
        showPopupWithClose(() => {
            renderBoard();
            updatePlayerStats();
        });

    } else {
        // 💀 Andre møte → Game Over
        popupTitle.innerText = "💀 Gollum Got You!";
        popupMessage.innerText = `“No more sneaking, preciousss! We takes it now!”\n\n💀 “My preciousss... it’s ours!”\n⚫ *You were devoured by Gollum in the dark tunnels of Moria.*`;
        popupButton.style.display = "inline-block";   // 🔄 Restart-knapp vises
        popupButton.innerText = "🔄 Restart Game";
        closeIcon.style.display = "none";             // 🚫 Ingen X på Game Over

        popupButton.onclick = function () {
            closePopup();
            restartGame();
        };

        popup.classList.remove('hidden');
        popup.style.opacity = "1";
        popup.style.visibility = "visible";
    }
}


// ========================================
// 🔄 4. Funksjoner for popup-håndtering
// ========================================

// 🎬 Midlertidig popup for skattesamling
function showTreasurePopup(treasure) {
    const popup = document.getElementById('treasurePopup');
    const message = document.getElementById('treasureMessage');

    message.innerHTML = `✨ Collected: ${treasure}`;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500); // ⏳ Popup forsvinner automatisk
}

// ❌ Legg til lukke-ikon (X) på popup
function addCloseIconToPopup(closeCallback) {
    const popupContent = document.querySelector('.popup-content');
    let closeIcon = document.getElementById('popupCloseIcon');

    if (!closeIcon) {
        closeIcon = document.createElement('span');
        closeIcon.id = 'popupCloseIcon';
        closeIcon.innerHTML = '❌';
        closeIcon.style.position = 'absolute';
        closeIcon.style.top = '10px';
        closeIcon.style.right = '15px';
        closeIcon.style.cursor = 'pointer';
        closeIcon.style.fontSize = '1.5rem';
        closeIcon.style.color = '#fff';
        closeIcon.title = 'Close';
        popupContent.appendChild(closeIcon);
    }

    closeIcon.onclick = function () {
        closeCallback();                                  // 🏃 Lukk popup og fortsett spillet
    };
}

// 🎬 Popup som støtter lukking med X
function showPopupWithClose(callback) {
    const popup = document.getElementById('gamePopup');
    const closeIcon = document.getElementById('popupCloseIcon');

    popup.classList.remove('hidden');
    popup.style.opacity = "1";
    popup.style.visibility = "visible";

    closeIcon.style.display = "block"; // ✅ Vis X kun ved encounter popup
    closeIcon.onclick = function () {
        popup.classList.add('hidden');
        popup.style.opacity = "0";
        popup.style.visibility = "hidden";
        callback();                      // 🏃 Gå tilbake til spillet
    };
}


// 🔒 Lukker popup og oppdaterer brettet
function closePopup() {
    const popup = document.getElementById('gamePopup');
    popup.style.opacity = "0";
    popup.style.visibility = "hidden";
    popup.classList.add('hidden');
    renderBoard();
    updatePlayerStats();
}

// ========================================
// 💀 5. Game Over-funksjon (Balrog eller helse = 0)
// ========================================
function gameOver(victory, cause = "") {
    document.removeEventListener('keydown', handleKeyPress);

    const popup = document.getElementById('gamePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    const popupButton = popup.querySelector('button');
    const closeIcon = document.getElementById('popupCloseIcon');

    if (victory) {
        popupTitle.innerText = "🏆 Victory!";
        popupMessage.innerText = `All treasures of Moria are yours!\n\n🕹️ Moves used: ${player.moves}`;
    } else {
        popupTitle.innerText = "🔥 Game Over!";
        popupMessage.innerText = cause === "balrog" 
            ? `🔥 *"You hear a deep growl echoing through the halls..."*\n⚡ *"A shadow and a flame descends upon you!"*\n💀 *"Durin's Bane has claimed another soul in Moria."*\n\n🕹️ *"You shall not pass..."*`
            : `You were defeated in the depths of Moria.\n\n🕹️ Moves made: ${player.moves}`;
    }

    popupButton.style.display = "inline-block";
    popupButton.innerText = "🔄 Restart Game";
    closeIcon.style.display = "none";  // 🚫 Ingen X på Game Over

    popupButton.onclick = function () {
        closePopup();
        restartGame();
    };

    popup.classList.remove('hidden');
    popup.style.opacity = "1";
    popup.style.visibility = "visible";
}

// ========================================
// 🔁 6. Restart spillfunksjon (full tilbakestilling)
// ========================================
function restartGame() {
    player.x = 0;
    player.y = 0;
    player.inventory = [];
    player.moves = 0;
    player.gollumEncounters = 0;  // 🐟 Nullstill Gollum encounters
    generateBoard();
    renderBoard();
    updatePlayerStats();
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

// ========================================
// 🐟 7. Gollum bevegelseslogikk (mot spilleren)
// ========================================
let gollumTurn = false; // ⏳ Gollum beveger seg annenhver runde

function moveGollum() {
    gollumTurn = !gollumTurn;
    if (!gollumTurn) return;                            // 🕑 Gollum venter denne runden

    let gollumX, gollumY;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (gameBoard[i][j] === '🐟 Gollum') {
                gollumX = i;
                gollumY = j;
            }
        }
    }

    const dx = player.x - gollumX;
    const dy = player.y - gollumY;
    let moveX = 0, moveY = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
        moveX = dx > 0 ? 1 : -1;
    } else if (dy !== 0) {
        moveY = dy > 0 ? 1 : -1;
    }

    if (gollumX + moveX >= 0 && gollumX + moveX < 5 && gollumY + moveY >= 0 && gollumY + moveY < 5) {
        gameBoard[gollumX][gollumY] = '';
        gollumX += moveX;
        gollumY += moveY;
        gameBoard[gollumX][gollumY] = '🐟 Gollum';

        if (player.x === gollumX && player.y === gollumY) fightGollum();  // ⚔️ Kamp hvis Gollum tar spilleren
    }
}
function moveBalrog() {
    // 🔥 Finn nåværende posisjon til Balrog
    let balrogX, balrogY;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (gameBoard[i][j] === '🔥 Balrog') {
                balrogX = i;
                balrogY = j;
            }
        }
    }

    // 🎲 Mulige retninger Balrog kan bevege seg
    const directions = [
        { x: -1, y: 0 }, // opp
        { x: 1, y: 0 },  // ned
        { x: 0, y: -1 }, // venstre
        { x: 0, y: 1 }   // høyre
    ];

    // 🚀 Filtrer ut retninger som går utenfor brettet
    const validMoves = directions.filter(dir =>
        balrogX + dir.x >= 0 &&
        balrogX + dir.x < 5 &&
        balrogY + dir.y >= 0 &&
        balrogY + dir.y < 5 &&
        !gameBoard[balrogX + dir.x][balrogY + dir.y].includes('💎') &&  // 🚫 Ikke over skatter
        !gameBoard[balrogX + dir.x][balrogY + dir.y].includes('🛡️') &&
        !gameBoard[balrogX + dir.x][balrogY + dir.y].includes('📜') &&
        !gameBoard[balrogX + dir.x][balrogY + dir.y].includes('🐟')     // 🚫 Ikke over Gollum
    );

    // 🎯 Velg en tilfeldig gyldig bevegelse
    if (validMoves.length > 0) {
        const move = validMoves[Math.floor(Math.random() * validMoves.length)];
        gameBoard[balrogX][balrogY] = ''; // 🔄 Fjern Balrog fra nåværende posisjon
        balrogX += move.x;
        balrogY += move.y;
        gameBoard[balrogX][balrogY] = '🔥 Balrog';

        // 💀 Sjekk om Balrog landet på Gimli → Game Over med episk tekst
        if (player.x === balrogX && player.y === balrogY) {
            gameOver(false, "balrog");  // ⚡ Spesialtekst for Balrog
        }
    }
}


