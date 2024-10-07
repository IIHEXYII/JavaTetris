document.addEventListener('DOMContentLoaded', () => {
//generates div grid
const container = document.querySelector('.grid');
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


const width = 10;
const grid = document.querySelector('.grid');
let squares = Array.from(document.querySelectorAll('.grid div'));
//TODO const ScoreDisplay = document.querySelector('#score');
//TODO const StartBtn = document.querySelector('#start-button');
let nextRandom = 0


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
timerId =  setInterval(moveDown,1000)

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
    draw()}

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
}
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


//rotating shapes

function rotate() {
    undraw()
    currentRotation ++
    if (currentRotation === current.length) { // Wil make it select 0 again once it reach the end of the array
        currentRotation = 0
    }
    current = theTetrominoes [random][currentRotation]
    draw()
}






















})