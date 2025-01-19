const gameBoardHTML = document.querySelector('#game-board');
const startBtn = document.querySelector('#start');
const restartBtn = document.querySelector('#restart');
const confetti = '&#127881;';

// *displayController
const displayController = (() =>{
    const renderMessage = (message) =>{
        document.querySelector('#message').innerHTML = message;
    }
    return { renderMessage }
})();

// *GameBoard
const GameBoard = (()=>{
    const gameBoard = ["", "", "", "", "", "", "", "", ""] 

    const render = () =>{
        let boardHTML = '';
        gameBoard.forEach((value, index)=>{
            boardHTML += 
            `
                <div class="square" id="square-${index}">
                    ${value} 
                </div>
            `;
        });
        gameBoardHTML.innerHTML = boardHTML;

        document.querySelectorAll('.square').forEach((square)=>{
            square.addEventListener('click', Game.handleClick)
        });
    }

    const update = (index, mark) =>{
        gameBoard[index] = mark;
        render();
    }

    const getGameBoard = () => gameBoard;

    return {
        render,
        update,
        getGameBoard
    }
})();

// *create player
const createPlayer = (name, mark)=>{
    return{
        name,
        mark
    }
};

// *Game
const Game = (()=>{
    let players = [];
    let gameOver;
    let currentPlayerIndex;

    const start = () =>{
        players = [
            createPlayer(document.querySelector('#playerX').value || 'player X', 'X'),
            createPlayer(document.querySelector('#playerO').value || 'player O', 'O')
        ];
        gameOver = false;
        currentPlayerIndex = 0;
        GameBoard.render();
    }

    const restart = () =>{
        for(let i = 0; i < 9; i++){
            GameBoard.update(i, "");
        }

        document.querySelector('#message').textContent = '';
        gameOver = false;
        GameBoard.render();
    }

    const handleClick = (event) =>{
        // *return if gameOver = true
        if(gameOver) return;

        const index = parseInt(event.target.id.split('-')[1]);

        // *if index already have value it cannot be override
        if(GameBoard.getGameBoard()[index] !== "") return;

        GameBoard.update(index, players[currentPlayerIndex].mark);

        if(checkForWin(GameBoard.getGameBoard())){
            gameOver = true;
            displayController.renderMessage(
                `${players[currentPlayerIndex].name} WIN!!!${confetti}`
            );
        } else if(checkForTie(GameBoard.getGameBoard())){
            gameOver = true;
            displayController.renderMessage(
                `IT'S A TIE!!!${confetti}`
            );
        } 
        // *check who's player turn and switch them
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    return {
        start,
        restart,
        handleClick
    }
})();

// *check if win
function checkForWin(board){
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i = 0; i < winningCombination.length; i++){
        const [value1, value2, value3] = winningCombination[i];

        if(board[value1] && board[value1] === board[value2] && board[value1] === board[value3]){
            return true;
        }
    }
}

// *check if tie
function checkForTie(board){
    return board.every(value => value !== "");
}

// *Game start
startBtn.addEventListener('click', ()=>{
    Game.start();
});
// *Game restart
restartBtn.addEventListener('click', ()=>{
    Game.restart();
});