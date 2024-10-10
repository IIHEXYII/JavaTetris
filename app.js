document.addEventListener('DOMContentLoaded', () => {
//generates div grid
const container = document.querySelector('.grid');
const miniGrid = document.querySelector('.mini-grid');
for (let i = 0; i < 200; i++) {
    const div = document.createElement('div');
    div.className = 'squares';
    container.appendChild(div);
}
for (let i = 0; i < 10; i++) {
    const div = document.createElement('div');
    div.className = 'taken';
    container.appendChild(div);
}
for (let i = 0; i < 16; i++) {
    const div = document.createElement('div');
    miniGrid.appendChild(div);
}

const startBtn = document.querySelector('#start-button');
let squares = Array.from(document.querySelectorAll('.grid div'));
const scoreDisplay = document.querySelector('#score');
const grid = document.querySelector('.grid');
const width = 10;
let nextRandom = 0
let timerId
let score = 0


const colors = [
    'red',
    'orange',
    'green',
    'blue',
    'purple'
]

//The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
]

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
// sets the initial position and default orientation.
let currentPosition = 4
let currentRotation = 0

let random  = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes [random] [currentRotation]

console.log(random);

//draw the tetromino
function draw() {
    current.forEach(index => {
    squares[currentPosition + index].classList.add('tetromino')
    squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}
//undraw the tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}


//makle the tetromino moving down every second
// timerId =  setInterval(moveDown,1000)

// move tetromino down
function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
}


//Stop shapes
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    // spawn new Tetromino
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random] [currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()
    }
}   

//assign functions to keyCodes
function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    } else if (e.keyCode === 38) {
        rotate()
    } else if (e.keyCode === 39) {
        moveRight()
    } else if (e.keyCode === 40) {
        moveDown()
    }
}

document.addEventListener('keyup', control)
//move the tetromino Left, unless is at the edge or there is a blockage
function moveLeft() {
undraw()
const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
if(!isAtLeftEdge) currentPosition -=1
if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition +=1
}s
draw()
}

//move the tetromino right, unless is at the edge or there is a blockage
function moveRight() {
undraw()
const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
if(!isAtRightEdge) currentPosition +=1
if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition -=1
}
draw()
}


//rotating Tetromino shapes

function rotate() {
    undraw();
    const originalRotation = currentRotation;
    currentRotation++;
    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    let newCurrent = theTetrominoes[random][currentRotation];

    // Check if the new rotation is out of bounds
    const isAtRightEdge = newCurrent.some(index => (currentPosition + index) % width === width - 1);
    const isAtLeftEdge = newCurrent.some(index => (currentPosition + index) % width === 0);
    const isOutOfBounds = newCurrent.some(index => (currentPosition + index) < 0 || (currentPosition + index) >= squares.length);

    if (isAtRightEdge || isAtLeftEdge || isOutOfBounds) {
        // Try to move left or right to fit the rotation
        if (isAtRightEdge) {
            currentPosition -= 1;
            newCurrent = theTetrominoes[random][currentRotation];
            if (newCurrent.some(index => (currentPosition + index) % width === width - 1 || (currentPosition + index) < 0 || (currentPosition + index) >= squares.length)) {
                currentPosition += 1; // Revert if still out of bounds
                currentRotation = originalRotation;
                newCurrent = theTetrominoes[random][currentRotation];
            }
        } else if (isAtLeftEdge) {
            currentPosition += 1;
            newCurrent = theTetrominoes[random][currentRotation];
            if (newCurrent.some(index => (currentPosition + index) % width === 0 || (currentPosition + index) < 0 || (currentPosition + index) >= squares.length)) {
                currentPosition -= 1; // Revert if still out of bounds
                currentRotation = originalRotation;
                newCurrent = theTetrominoes[random][currentRotation];
            }
        } else if (isOutOfBounds) {
            currentRotation = originalRotation;
            newCurrent = theTetrominoes[random][currentRotation];
        }
    }

    current = newCurrent;
    draw();
}

  //show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

// display next Tetromino
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

// display the shape
function displayShape() {
    // remove any trace of Tetromino
    displaySquares.forEach(square => {
    square.classList.remove('tetromino')    
    square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]

    })
}


startBtn.addEventListener('click', () => {
if (timerId) {
    clearInterval(timerId) 
    timerId = null
} else {
    draw()
    timerId = setInterval(moveDown, 1000)
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
    }
})



// Add a score
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        } else {
            row.forEach(index => {
                if (!squares[index].classList.contains('taken') && !squares[index].classList.contains('tetromino')) {
                    squares[index].style.backgroundColor = 'bisque'
                }
            })
        }
    }
}

//gameover 

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        clearInterval(timerId)
    }
}






})