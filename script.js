const Game = () => {
    const board = Array(9).fill("");
    let gameOver = false;
    let round = 1;

    const stop = () => {
        gameOver = true;
    };

    const isOver = () => {
        return gameOver;
    }

    const getEmptyIndices = () => {
        const indices = [];

        board.forEach((value, index) => {
            if (value === "") {
                indices.push(index);
            }
        });

        return indices;
    };

    const getCell = (cell) => {
        return board[cell];
    };

    const setCell = (cell, sign) => {
        board[cell] = sign;
    };

    const setRandomCell = (sign) => {
        const emptyIndices = getEmptyIndices();

        if (emptyIndices.length === 0) {
            return;
        }

        const randomCell = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        board[randomCell] = sign;
    }

    const reset = () => {
        for (let index = 0; index < board.length; index++) {
            board[index] = "";
        }

        cellElements.forEach(cell => {
            cell.textContent = "";
        });

        gameOver = false;
        round = 1;
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    }

    const update = () => {
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });

        round++;
    };

    const getWinner = () => {
        for (let i = 0; i < 3; i++) {
            if (board[i * 3] === board[i * 3 + 1] && board[i * 3] === board[i * 3 + 2] && board[i * 3] !== '') {
                return board[i * 3];
            }
        }
    
        for (let i = 0; i < 3; i++) {
            if (board[i] === board[i + 3] && board[i] === board[i + 6] && board[i] !== '') {
                return board[i];
            }
        }
    
        if ((board[0] === board[4] && board[0] === board[8] && board[0] !== '') ||
            (board[2] === board[4] && board[2] === board[6] && board[2] !== '')) {
            return board[4];
        }
    
        return null;
    }

    const getRound = () => {
        return round;
    }

    return { stop, reset, update,
             setCell, setRandomCell, setMessage,
             getCell, getEmptyIndices, getWinner, getRound,
             isOver };
};

const game = Game();

const Player = (sign) => {
    const getSign = () => {
        return sign;
    }

    return { getSign };
};

let player = null;
let cpu = null;

const buttonX = document.getElementById("button-x");
const buttonO = document.getElementById("button-o");
const restartButton = document.getElementById("restartButton");

const cellElements = document.querySelectorAll(".cell");
const messageElement = document.getElementById("message");

cellElements.forEach(cell => {
    cell.addEventListener("click", event => {
        const cellIndex = event.target.getAttribute("data-index");

        if (game.getCell(cellIndex) !== "" || game.isOver()) {
            return;
        }

        game.setCell(cellIndex, player.getSign());
        game.setRandomCell(cpu);
        game.update();

        if (game.getRound() === 6) {
            game.setMessage("Draw");
            game.stop();
        }

        const winner = game.getWinner();

        if (winner !== null) {
            game.setMessage(`${winner} has won`);
            game.stop();
        }
    })
});

buttonX.addEventListener("click", () => {
    player = Player('X');
    cpu = 'O';

    game.reset();
    game.setMessage("You are X");
});

buttonO.addEventListener("click", () => {
    player = Player('O');
    cpu = 'X';

    game.reset();
    game.setMessage("You are O");
    game.setRandomCell(cpu);
    game.update();
});

restartButton.addEventListener("click", () => {
    if (player === null) {
        return;
    }

    game.reset();
});