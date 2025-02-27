// board.js - Genererer og renderer spillbrettet

// 🎁 Skatter i spillet
const treasures = ["💎 Durin's Crown", "🛡️ Mithril Vest", "📜 Book of Mazarbul"];

// 🌟 5x5 tomt brett (tilbakestilles ved hver start)
let gameBoard = Array.from({ length: 5 }, () => Array(5).fill(''));

// 🎲 Funksjon for å plassere elementer tilfeldig på brettet
function placeRandomly(item) {
    let x, y;
    do {
        x = Math.floor(Math.random() * 5);
        y = Math.floor(Math.random() * 5);
    } while (gameBoard[x][y] !== '' || (x === 0 && y === 0)); // 🚫 Ikke plasser der Gimli starter
    gameBoard[x][y] = item;
}

// 🌌 Genererer brettet med riktige elementer
function generateBoard() {
    gameBoard = Array.from({ length: 5 }, () => Array(5).fill(''));
    treasures.forEach(t => placeRandomly(t));
    placeRandomly('🔥 Balrog');
    gameBoard[4][0] = '🐟 Gollum'; // 📍 Plasser Gollum fast i nedre venstre hjørne
}


// 🖼️ Renderer spillbrettet i DOM
function renderBoard() {
    const boardTable = document.getElementById('gameBoard');
    boardTable.innerHTML = ''; // 🧹 Tøm tidligere brett

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('td');
            cell.classList.add('cell');

            // 🌫️ Fog of War: Kun celler nær Gimli synlige
            const isVisible = Math.abs(player.x - i) <= 1 && Math.abs(player.y - j) <= 1;
            if (isVisible) {
                cell.classList.add('visible');
            } else {
                cell.classList.add('fog');
            }

            // 🪓 Gimli (Spilleren)
            if (i === player.x && j === player.y) {
                cell.classList.add('player');
                cell.innerHTML = '<div class="glow player-glow"><img src="images/gimli.webp" alt="Gimli"></div>';
            }
            // 👑 Durin's Crown
            else if (gameBoard[i][j].includes('Durin\'s Crown')) {
                cell.classList.add('treasure');
                cell.innerHTML = '<div class="glow treasure-glow"><img src="images/crown.webp" alt="Durin\'s Crown"></div>';
            }
            // 🛡️ Mithril Vest
            else if (gameBoard[i][j].includes('Mithril Vest')) {
                cell.classList.add('treasure');
                cell.innerHTML = '<div class="glow treasure-glow"><img src="images/mithril.webp" alt="Mithril Vest"></div>';
            }
            // 📜 Book of Mazarbul
            else if (gameBoard[i][j].includes('Book of Mazarbul')) {
                cell.classList.add('treasure');
                cell.innerHTML = '<div class="glow treasure-glow"><img src="images/book.webp" alt="Book of Mazarbul"></div>';
            }
            // 🔥 Balrog (Fiende)
            else if (gameBoard[i][j] === '🔥 Balrog') {
                cell.classList.add('balrog');
                cell.innerHTML = '<div class="glow balrog-glow"><img src="images/balrog.webp" alt="Balrog"></div>';
            }
            else if (gameBoard[i][j] === '🐟 Gollum') {
                cell.classList.add('gollum');
                cell.innerHTML = '<div class="glow gollum-glow"><img src="images/gollum.webp" alt="Gollum"></div>';
            }            

            row.appendChild(cell);
        }
        boardTable.appendChild(row);
    }
}






