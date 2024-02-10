const gameBoard = (() => {
    let boardSize = 3;
    let board = [];

    const getBoardSize = () => boardSize;

    const setBoardSize = (value) => {
        boardSize = value;
        resetBoard();
    }

    const getBoard = () => board;

    const printBoard = () => {
        let string = ``;
        for(let i = 0; i < boardSize; i++) {
            for(let j = 0; j < boardSize; j++) {
                string += `${board[i][j]} `;
            }
            string += `\n`;
        }
        console.log(string);
    };

    const resetBoard = () => {
        board = [];
        for(let i = 0; i < boardSize; i++) {
            board[i] = [];
            for(let j = 0; j < boardSize; j++) {
                board[i][j] = 0;
            }
        }
    };

    resetBoard();

    const getBoardCellValue = (i, j) => board[i][j];

    const setBoardCellValue = (i, j, value) => {
        if(board[i][j] !== 0) return;
        board[i][j] = value;
    };

    return { getBoardSize, setBoardSize, getBoard, printBoard, resetBoard, setBoardCellValue, getBoardCellValue };
})();

const Player = (sign, name) => {
    const player = {
        name,
        sign,
        active: false,
        winner: false,
        getName: () => player.name,
        setName: (newName) => player.name = newName,
        getSign: () => player.sign,
        getState: () => player.active,
        setState: (newState) => player.active = newState,
        getWinnerState: () => player.winner,
        setWinnerState: (newWinner) => player.winner = newWinner,
    };

    return player;
}

const gameController = (() => {
    const playerOne = Player('X', "Player One");
    const playerTwo = Player('O', "Player Two");

    playerOne.setState(true);

    const getActivePlayer = () => playerOne.getState() === true ? playerOne : playerTwo;
    let activePlayer = getActivePlayer();

    const switchPlayerTurn = () => {
        playerOne.getState() === true ? playerOne.setState(false) : playerOne.setState(true);
        playerTwo.getState() === true ? playerTwo.setState(false) : playerTwo.setState(true);
        activePlayer = getActivePlayer();
    };

    const newRound = () => {
        gameBoard.printBoard();
        console.log(`${activePlayer.getName()}'s turn...`);
    };

    const playRound = (i, j) => {
        if(gameBoard.getBoardCellValue(i, j) !== 0) {
            console.log("Can't play in that position!");
            console.log(`${activePlayer.getName()}'s turn...`);
        }
        else if(checkRound.getGameWon() === true || checkRound.tie() === true) {
            return 0;
        }
        else {
            gameBoard.setBoardCellValue(i, j, activePlayer.getSign());
            console.log(`${activePlayer.getName()} plays ${activePlayer.getSign()} in position 
            [${i}, ${j}]...`);

            if(checkRound.win()) {
                console.log(`${activePlayer.getName()} (${activePlayer.getSign()}) won!!!`);
                gameBoard.printBoard();
                displayController.setLiveMessage(`${activePlayer.getName()} (${activePlayer.getSign()}) won!!!`);
            } else if(checkRound.tie()) {
                console.log("It's a tie!");
                gameBoard.printBoard();
                displayController.setLiveMessage("It's a tie!");
            } else {
                switchPlayerTurn();
                newRound();
                displayController.setLiveMessage(`${gameController.getActivePlayer().getName()}'s turn... [${gameController.getActivePlayer().getSign()}]`);
            }
            displayController.updateBoard();
        }
    };

    const checkRound = (() => {
        const checkSize = gameBoard.getBoardSize();
        let gameWon = false;

        const checkRow = (row) => {
            for(let j = 1; j < checkSize; j++) {
                if(gameBoard.getBoardCellValue(row, j) !== gameBoard.getBoardCellValue(row, 0) ||
                gameBoard.getBoardCellValue(row, j) === 0) return false;
            }
            return true;
        };

        const checkCol = (col) => {
            for(let i = 1; i < checkSize; i++) {
                if(gameBoard.getBoardCellValue(i, col) !== gameBoard.getBoardCellValue(0, col) ||
                gameBoard.getBoardCellValue(i, col) === 0) return false;
            }
            return true;
        };

        const checkDiag = (diagType) => {
            if(diagType === 1) {
                for(let i = 1; i < checkSize; i++) {
                    if(gameBoard.getBoardCellValue(i, i) !== gameBoard.getBoardCellValue(0, 0) ||
                    gameBoard.getBoardCellValue(i, i) === 0) return false;
                }
            } else if(diagType === 2) {
                for(let i = 1; i < checkSize; i++) {
                    if(gameBoard.getBoardCellValue(i, checkSize - 1 - i) !== gameBoard.getBoardCellValue(0, checkSize - 1) ||
                    gameBoard.getBoardCellValue(i, checkSize - 1 - i) === 0) return false;
                }
            }
            return true;
        };

        const win = () => {
            if(!gameWon) {
                if(checkDiag(1) || checkDiag(2)) {
                    activePlayer.setWinnerState(true);
                    gameWon = true;
                }
                for(let i = 0; i < checkSize; i++) {
                    if(gameWon) break;
                    if(checkRow(i)) {
                        activePlayer.setWinnerState(true);
                        gameWon = true;
                        break;
                    } else if(checkCol(i)) {
                        activePlayer.setWinnerState(true);
                        gameWon = true;
                        break;
                    }
                }
            }
            return gameWon;
        };

        const tie = () => {
            for(let i = 0; i < checkSize; i++) {
                for(let j = 0; j < checkSize; j++) {
                    if(gameBoard.getBoardCellValue(i, j) === 0) return false;
                }
            }
            return true;
        };

        const getGameWon = () => gameWon;
        const setGameWon = (newGameWon) => gameWon = newGameWon;

        return { getGameWon, setGameWon, win, tie }
    })();

    const resetGame = () => {
        checkRound.setGameWon(false);
        playerOne.setState(true);
        playerTwo.setState(false);
        playerOne.setWinnerState(false);
        playerTwo.setWinnerState(false);
        activePlayer = playerOne;
        gameBoard.resetBoard();
    };

    //newRound();

    return { playRound, resetGame, getActivePlayer, playerOne, playerTwo, newRound };
})();

const displayController = (() => {
    const gameMenu = document.getElementById("gameMenu");
    const menu = document.getElementById("menu");
    const liveMessage = document.getElementById('liveMessage');
    const restartButton = document.getElementById('restartButton');
    const menuButton = document.getElementById('menuButton');
    const boardElement = document.getElementById('board');
    let boardCells = [];

    const createBoard = () => {
        const board = gameBoard.getBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const divCell = document.createElement('div');
                divCell.classList.add('cell');
                divCell.dataset.index = `[${rowIndex}][${cellIndex}]`;
                divCell.dataset.activeSign = `${gameController.getActivePlayer().getSign()}`;

                divCell.addEventListener('click', () => {
                    gameController.playRound(rowIndex, cellIndex);
                });

                const spanCell = document.createElement('span');
                spanCell.textContent = "";

                divCell.appendChild(spanCell);
                boardElement.appendChild(divCell);
            });
        });

        boardCells = document.getElementsByClassName('cell');
    };
    
    const updateBoard = () => {
        for(let i = 0; i < boardCells.length; i++) {
            const cellIndex = boardCells[i].dataset.index.match(/\d+/g);
            const cellValue = gameBoard.getBoardCellValue(cellIndex[0], cellIndex[1]);
            const spanCell = boardCells[i].querySelector('span');
            spanCell.textContent = cellValue !== 0 ? cellValue : "";

            if(cellValue === 0) {
                boardCells[i].dataset.activeSign = `${gameController.getActivePlayer().getSign()}`;
            } else {
                boardCells[i].dataset.activeSign = "";
            }
        }
    };

    const destroyBoard = () => {
        while(boardCells[0]) {
            boardCells[0].remove();
        }
        /*const board = document.getElementById("board");
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                board.removeChild(board.firstChild);
            })
        })*/
    };

    const setLiveMessage = (msg) => liveMessage.innerText = msg;
    const getLiveMessage = () => liveMessage;

    restartButton.addEventListener('click', (event) => {
        event.preventDefault();

        gameController.resetGame();
        gameController.newRound();
        displayController.updateBoard();
        displayController.setLiveMessage(`${gameController.getActivePlayer().getName()}'s turn... [${gameController.getActivePlayer().getSign()}]`);
    });

    menuButton.addEventListener('click', (event) => {
        event.preventDefault();

        gameController.resetGame();
        displayController.destroyBoard();

        gameMenu.classList.add("hidden");
        menu.classList.remove("hidden");
    });

    return { createBoard, updateBoard, destroyBoard, setLiveMessage, getLiveMessage };
})();

const menuController = (() => {
    const gameMenu = document.getElementById("gameMenu");
    const menu = document.getElementById("menu");

    const formMenu = document.getElementById("form-menu");
    const playerOneInput = document.getElementById("playerOneName");
    const playerTwoInput = document.getElementById("playerTwoName");

    formMenu.addEventListener('submit', (event) => {
        event.preventDefault();
        
        gameController.playerOne.setName(playerOneInput.value); 
        gameController.playerTwo.setName(playerTwoInput.value);
        gameController.newRound();

        displayController.createBoard();
        displayController.setLiveMessage(`${gameController.getActivePlayer().getName()}'s turn... [${gameController.getActivePlayer().getSign()}]`);

        gameMenu.classList.remove("hidden");
        menu.classList.add("hidden");
    });
})();