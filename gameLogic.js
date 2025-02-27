// =======================================================
// 🏹 gameLogic.js - Spilllogikk, inventory, vinn/tap, kamp
// =======================================================

// ========================================
// 📊 1. Oppdater spillerstatistikk (helse, skatter, trekk)
// ========================================
function updatePlayerStats() {
    const playerStats = document.getElementById('playerStats');
    playerStats.innerHTML = `
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
        if (player.inventory.length === treasures.length) gameOver(true);

    } else if (cellContent === '🔥 Balrog') {
        gameOver(false, "balrog"); // 💀 Game Over ved Balrog

    } else if (cellContent === '🐟 Gollum') {
        if (player.gollumEncounters < 1) {
            fightGollum(); // ⚔️ Første møte
        } else {
            gameOver(false, "gollum"); // 💀 Andre møte = Game Over
        }
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

    // 📊 Øk Gollum-møtetelleren
    player.gollumEncounters++;

    if (player.gollumEncounters === 1) {
        // 🐟 Første møte - popup og lyd
        sounds.gollum1.play();
        popupTitle.innerText = "🐟 Gollum Appears!";
        popupMessage.innerText = `“Hisss... Who goes there? A dwarf? My preciousss smells you!”\n\n⚠️ “We watches you... One more time and we takes it!”`;
        popupButton.style.display = "none";  // 🚫 Ingen restart-knapp
        closeIcon.style.display = "block";   // ✅ Vis X for å lukke
        showPopupWithClose(() => {
            renderBoard();
            updatePlayerStats();
        });

    } else if (player.gollumEncounters === 2) {
        // 💀 Andre møte - Game Over
        sounds.gollum2.play();
        gameOver(false, "gollum");
    }
}

// ========================================
// 🔄 4. Funksjoner for popup-håndtering
// ========================================
function showTreasurePopup(treasure) {
    const popup = document.getElementById('treasurePopup');
    const message = document.getElementById('treasureMessage');

    message.innerHTML = `✨ Collected: ${treasure}`;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 2500); // ⏳ Popup forsvinner automatisk
}

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
        callback(); // 🏃 Gå tilbake til spillet
    };
}

function closePopup() {
    const popup = document.getElementById('gamePopup');
    popup.style.opacity = "0";
    popup.style.visibility = "hidden";
    popup.classList.add('hidden');
    renderBoard();
    updatePlayerStats();
}

// ========================================
// 💀 5. Game Over-funksjon (Balrog eller Gollum)
// ========================================
function gameOver(victory, cause = "") {
    document.removeEventListener('keydown', handleKeyPress);

    const popup = document.getElementById('gamePopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupMessage = document.getElementById('popupMessage');
    const popupButton = popup.querySelector('button');
    const closeIcon = document.getElementById('popupCloseIcon');

    if (victory) {
        // 🏆 Seier
        sounds.victory.play();
        popupTitle.innerText = "🏆 Victory!";
        popupMessage.innerText = `All treasures of Moria are yours!\n\n🕹️ Moves used: ${player.moves}`;
    } else if (cause === "balrog") {
        // 🔥 Balrog Game Over
        sounds.balrog.play();
        popupTitle.innerText = "🔥 The Balrog Caught You!";
        popupMessage.innerText = `🔥 *"You hear a deep growl echoing through the halls..."*\n⚡ *"A shadow and a flame descends upon you!"*\n💀 *"Durin's Bane has claimed another soul in Moria."*\n\n🕹️ *"You shall not pass..."*`;
    } else if (cause === "gollum") {
        // 🐟 Gollum Game Over
        sounds.gollum2.play();
        popupTitle.innerText = "💀 Gollum Got You!";
        popupMessage.innerText = `“No more sneaking, preciousss! We takes it now!”\n\n💀 “My preciousss... it’s ours!”\n⚫ *You were devoured by Gollum in the dark tunnels of Moria.*`;
    }

    popupButton.style.display = "inline-block";
    popupButton.innerText = "🔄 Restart Game";
    closeIcon.style.display = "none"; // 🚫 Ingen X på Game Over

    popupButton.onclick = function () {
        closePopup();
        restartGame();
    };

    popup.classList.remove('hidden');
    popup.style.opacity = "1";
    popup.style.visibility = "visible";
}

// ========================================
// 🔁 6. Restart spillfunksjon
// ========================================
function restartGame() {
    player.x = 0;
    player.y = 0;
    player.inventory = [];
    player.moves = 0;
    player.gollumEncounters = 0;
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
    if (!gollumTurn) return; // 🕑 Gollum venter denne runden

    let gollumX, gollumY;
    
    // 🔍 Finn Gollums nåværende posisjon
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (gameBoard[i][j] === '🐟 Gollum') {
                gollumX = i;
                gollumY = j;
            }
        }
    }

    // 📡 Bestem retning mot Gimli
    const dx = player.x - gollumX;
    const dy = player.y - gollumY;
    let moveX = 0, moveY = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
        moveX = dx > 0 ? 1 : -1;
    } else {
        moveY = dy > 0 ? 1 : -1;
    }

    // 🚀 Sjekk at bevegelsen er gyldig
    if (gollumX + moveX >= 0 && gollumX + moveX < 5 && gollumY + moveY >= 0 && gollumY + moveY < 5) {
        // 🚫 Ikke gå over Balrog eller skatter
        if (!gameBoard[gollumX + moveX][gollumY + moveY].includes('🔥') &&
            !gameBoard[gollumX + moveX][gollumY + moveY].includes('💎') &&
            !gameBoard[gollumX + moveX][gollumY + moveY].includes('🛡️') &&
            !gameBoard[gollumX + moveX][gollumY + moveY].includes('📜')) {

            // 🔄 Flytt Gollum
            gameBoard[gollumX][gollumY] = '';
            gollumX += moveX;
            gollumY += moveY;
            gameBoard[gollumX][gollumY] = '🐟 Gollum';

            // ⚔️ Hvis Gollum treffer spilleren → sjekk om det er første eller andre kamp
            if (player.x === gollumX && player.y === gollumY) {
                player.gollumEncounters++; // 📊 Øk Gollum-møtetelleren

                if (player.gollumEncounters === 1) {
                    fightGollum(); // ⚔️ Første møte - popup
                } else if (player.gollumEncounters === 2) {
                    gameOver(false, "gollum"); // 💀 Andre møte = Game Over
                }
            }
        }
    }
}

// ========================================
// 🔥 Balrog bevegelseslogikk (jakter på spilleren)
// ========================================
function moveBalrog() {
    let balrogX, balrogY;
    
    // 🔍 Finn Balrogs nåværende posisjon
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (gameBoard[i][j] === '🔥 Balrog') {
                balrogX = i;
                balrogY = j;
            }
        }
    }

    // 📡 Bestem retning mot Gimli
    const dx = player.x - balrogX;
    const dy = player.y - balrogY;
    let moveX = 0, moveY = 0;

    if (Math.abs(dx) > Math.abs(dy)) {
        moveX = dx > 0 ? 1 : -1;
    } else {
        moveY = dy > 0 ? 1 : -1;
    }

    // 🚀 Sjekk at bevegelsen er gyldig
    if (balrogX + moveX >= 0 && balrogX + moveX < 5 && balrogY + moveY >= 0 && balrogY + moveY < 5) {
        // 🚫 Ikke gå over Gollum eller skatter
        if (!gameBoard[balrogX + moveX][balrogY + moveY].includes('🐟') &&
            !gameBoard[balrogX + moveX][balrogY + moveY].includes('💎') &&
            !gameBoard[balrogX + moveX][balrogY + moveY].includes('🛡️') &&
            !gameBoard[balrogX + moveX][balrogY + moveY].includes('📜')) {

            // 🔄 Flytt Balrog
            gameBoard[balrogX][balrogY] = '';
            balrogX += moveX;
            balrogY += moveY;
            gameBoard[balrogX][balrogY] = '🔥 Balrog';

            // 💀 Hvis Balrog treffer spilleren → Game Over
            if (player.x === balrogX && player.y === balrogY) {
                gameOver(false, "balrog");
            }
        }
    }
}



