
// porneste cand html este incarcat
// inaintea imaginilor, css...
// targetul este catre fisierul html
document.addEventListener('DOMContentLoaded',() =>{

// metoda care cauta clasa cu numele 'grid'
// dupa ce o gaseste o asigneaza la constanta grid
const grid = document.querySelector('.grid');


// selecteaza toate div-urile din clasa 'grid'
// dupa ce le gaseste le asigneaza la squares
// si le transformam intr-un array
let squares = Array.from(document.querySelectorAll('.grid div'))

// 10 patratele latime
const width = 10
let nextRandom = 0
// timerId e null ( fara valoare )
let timerId
let score = 0


// selectam id-ul score
const scoreDisplay = document.querySelector('#score')


// selectam id-ul start button
const startButton = document.querySelector('#start-button')

// Assigning colors to our Tetrominos
const colors = [
    'green',
    'blue',
    'orange',
    'yellow',
    'brown',
    'read',
    'teal'
]

// Sounds
const soundMove = new Audio("sound/soundMove.mp3");
const soundRotate = new Audio("sound/soundRotate.mp3");
const soundDrop = new Audio("sound/soundDrop.mp3");
const soundClearRow = new Audio("sound/soundClear.mp3");
const soundGameOver = new Audio("sound/soundGameOver.mp3");
const soundStartGame = new Audio("sound/soundStartGame.mp3");


// desenam forma l
const lTetromino = [
    [1,width+1,width*2+1,2],
    [width,width+1,width+2,width*2+2],
    [1,width+1,width*2,width*2+1],
    [width,width*2,width*2+1,width*2+2],
]

// desenam forma z
const zTetromino = [
    [width+1,width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1,width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
]

// desenam forma t
const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1],
]

// desenam forma o
const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
]

// desenam forma i
const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
]

// cream o constanta in care le introducem
const theTetrominoes = [lTetromino, zTetromino, tTetromino,oTetromino, iTetromino];

// se stabileste unde incepem sa desenam formele in grid 
// prima va incepe la index 4 
let currentPosition = 4;

// prima rotatie pe fiecare forma
let currentRotation = 0;


// selectam forma L la prima rotatie, primul index din array
// Math.Floor va rotunji langa cel mai apropiat numar intreg
let random = Math.floor(Math.random()*theTetrominoes.length)

// intotdeauna va fi la prima rotatie random de tetromino
let current = theTetrominoes[random][currentRotation]

// desenam prima rotatie
// pentru fiecare index din array creeam o clasa tetrominoes pentru a le colora
// aplica logica pe fiecare item din array
// folosim arrow function pentru a adauga codul intre paranteze pentru fiecare index din array
// classList.add il folosim pentru a accesa style.css -> clasa tetrominoes
function draw (){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
// adaugam culoarea pe forma random
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}


// stergem forma
function undraw (){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
// stergem coloarea de pe forma
        squares[currentPosition + index].style.backgroundColor = ''
    })
}


// assingn functions to keyCodes
// fiecare tasta are un cod care se poate asigna in js
// keycode.info
// e pentru eveniment

function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
        soundMove.play();
    } else if (e.keyCode === 38) {
        rotate()
        soundRotate.play();
    } else if (e.keyCode === 39) {
        moveRight()
        soundMove.play();
    } else if (e.keyCode === 40) {
        moveDown()
        soundDrop.play();
    }
}

// asculta de fiecare data cand apasam o tasta si va invoca functia de mai sus control
// keyup event /  control function
document.addEventListener('keyup', control)


// move down function
// stergem forma din pozitia actuala si o desenam in urmatoarea pozitie
function moveDown (){
    undraw ()
// currentPosition = 4 + 10
    currentPosition += width
    draw()
    freeze()  
}

// .some() ca si forEach functioneaza si aplica logica pentru fiecare index din array
// si daca un item e adevarat tot array-ul e adevarat
// verificam daca logica din array este adevarata pentru unele elemente
// daca un element e adevarat e ok
// daca o patratica in jos contine clasa taken le transformam si pe cele din forma in clasa taken
function freeze () {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        soundDrop.play();
// start a new tetomino falling to be current tetromino
// let nextRandom il definim pentru mini-grid , sa ni-l afiseze inainte
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
// il setam ca primul tetromino la prima rotatie si il setam ca tetromino curent        
// il punem la pozitia curenta = 4
// desenam acest nou creat tetromino
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
// forma din mini-grid
        displayShape()
        addScore()
        gameOver()
    }
}


// miscam la stanga
// ii spunem PC-ului ca suntem la stanga grid-ului
// vrem ca formele sa nu iasa din cele 200 de div-uri si sa se opreasca la 0,10,20.30....
function moveLeft() {
// stergem forma
    undraw()
// definim partea stanga
// some verifica fiecare index din array si daca este adevarat atunci tot array-ul e adevarat
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0 )
// putem sa miscam forma in stanga doar daca nu este in margine
    if (!isAtLeftEdge) currentPosition -= 1
// forma se va opri daca este o alta forma acolo care e frozen
// forma o asignam la clasa taken
// daca unele patrateledin forma daca ajung in clasa taken cand merg in stanga sa le impingem inapoi un spatiu
// pentru fiecare index
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
// pentru a-l impinge o casuta inpoi in array
    currentPosition += 1
    }
    draw()
}


// move the tetromino right, unless is at edge or there is a blockage
function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
// daca nu am atins marginea din dreapta ne putem misca in continuare
    if(!isAtRightEdge) currentPosition += 1
// daca patratelele din forma ajung in cele din clasa taken sa le impinga inapoi un spatiu in array
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    currentPosition -+ 1
    }
    draw()
}

// Fix rotation of tetrominos at the edge

function isAtRight (){
    return current.some(index => (currentPosition + index + 1) % width === 0)
}

function isAtLeft () {
    return current.some(index => (currentPosition + index) % width === 0 )
}


function checkRotatedPosition (P){
    P = P || currentPosition // || sau -  get currrent position ; Then check if the form is near the left side
    if ((P+1) % width < 4) { //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
        if (isAtRight()){ //use actual position to check if it's flipped over to right side
            currentPosition += 1 //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5){
        if(isAtLeft()){
            currentPosition -= 1
            checkRotatedPosition(P)
        }
    }
}


// rotirea formelor
function rotate () {
    undraw()
// urmatoarea rotatie index 0 -> index 1
    currentRotation ++
// daca rotatia depaseste indexul 3 atunci se intoarce la index 0
// if the current rotation gets to 4, make it go back to 0
    if (currentRotation === current.length) {
        currentRotation = 0
    }
// daca conditia de mai sus este falsa atunci forma ia urmatoarea rotatie (index)
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
}

// Afisarea urmatoarei forme in mini-grid
// selecteaza toate div-urile din mini-grid
// metoda document.querySelectorAll
const displaySquares = document.querySelectorAll('.mini-grid div')
// definim de unde sa afiseze forma si in ce index (pozitie)
const displayWidth = 4
let displayIndex = 0


// afisam formele fara rotatie , fiecare cu index 0
const upNextTetrominoes = [
    [1,displayWidth+1,displayWidth*2+1,2], // lTetromino
    [displayWidth+1,displayWidth+2,displayWidth*2,displayWidth*2+1], // zTetromino
    [1,displayWidth,displayWidth+1,displayWidth+2], // tTetromino
    [0,1,displayWidth,displayWidth+1], // oTetromino
    [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1], // iTetromino
]

// afiseaza urmatoarea forma in mini-grid
function displayShape () {
// sterge formele din mini-grid
// pentru fiecare patratel il stergem din clasa tetromino din clasa mini-grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
// stergem culoarea urmatoarei forme din mini-grid
        square.style.backgroundColor = ''
    })
// pentru patratelele din mini-grid sa le adaugam in clasa tetromino
// si apoi le transferam in displaySquares
// forma dupa ce este vizibila in minigrid se sterge si apare in grid
    upNextTetrominoes[nextRandom].forEach (index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
// adaugam culoare pe urmatoarea forma din mini-grid
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}


// adaugam o functie de start / pauza 
// extensie la functia care coboara forma la un interval de o secunda
// de fiecare data cand apasam start invocam funtia moveDown
// setInterval ()
// clearInterval()
// startButton il legam de un eventListener
startButton.addEventListener('click', () => {
// daca butonul nu este apasat si valoarea nu este nula punem pauza la joc
    if(timerId){
        clearInterval(timerId)
        timerId = null }
// daca butonul este apasat desenam forma invocand functia moveDown la un interval de o secunda
            else {
                soundStartGame.play();
                draw()
                timerId = setInterval(moveDown,1000)
// selectem urmatoarea forma pe care o afisam in mini-grid
                nextRandom = Math.floor(Math.random() * theTetrominoes.length)
                displayShape()
            }
    })


// add score
    function addScore () {
        for ( let i = 0; i < 199; i += width){
// creeam linia 
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
// verificam daca fiecare patratel contine un div cu clasa taken
// daca contine si este adevarat :
            if(row.every(index => squares[index].classList.contains('taken'))){
// adaugam 10 la scor  
                soundClearRow.play();
                score += 10
// il afisam la jucator
                scoreDisplay.innerHTML = score
// pentru fiecare patratel stergem clasa taken si tetromino
                row.forEach(index => {
                    squares[index].classList.remove('taken')
// stergem clasa tetromino pentru ca sa nu apara pe prima linie
                    squares[index].classList.remove('tetromino')
// stergem culoarea din functia addScore
                    squares[index].style.backgroundColor = ''
                })
// stergem linia cu splice
// o adaugam la o constanta squaresRemove
                const sqaresRemoved = squares.splice(i,width)
                
// la patratelele sterse adaugam unele noi ( o linie noua )
// si o punem la sfarsit
                squares = sqaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

// GAME OVER using some() and innerHTML
// classList.contains('taken)
// daca este o forma din clasa 'taken' pe index 4 atunci 'GAME OVER'
// daca forma sau index-urile care sunt in pozitia currentPosition si contin clasa 'taken' va fi 'GAME OVER'
    function gameOver (){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        scoreDisplay.innerHTML = 'Game Over'
        soundGameOver.play();
// pentru a nu mai cobora urmatoarea forma
        clearInterval(timerId)
        }
    }

})