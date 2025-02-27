let player = {
    x: 0,
    y: 0,
    inventory: [],
    moves: 0,
    gollumEncounters: 0, // 🐟 Antall ganger spilleren har møtt Gollum

    move: function (direction) {
        let moved = false;
        switch (direction) {
            case 'ArrowUp': if (this.x > 0) { this.x--; moved = true; } break;
            case 'ArrowDown': if (this.x < 4) { this.x++; moved = true; } break;
            case 'ArrowLeft': if (this.y > 0) { this.y--; moved = true; } break;
            case 'ArrowRight': if (this.y < 4) { this.y++; moved = true; } break;
        }
        if (moved) this.moves++;  // 🔄 Øk trekk hvis faktisk bevegelse
    }
};


