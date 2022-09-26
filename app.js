document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const gameDisplay = document.querySelector('#game-over');
    const startBtn = document.querySelector('#start-button');
    const pauseBtn = document.querySelector('#pause-button');
    const width = 10;
    let timerId;
    let score = 0;

    const color = [
        '#3f37c9',
        'orange',
        '#FFD166',
        '#9381ff',
        '#72ddf7',
        '#06D6A0',
        '#EF476F'
    ];
    
    //tetrominoes
    const jTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const lTetromino = [
        [0, 1, width+1, width*2+1],
        [width+2, width*2, width*2+1, width*2+2],
        [1, width+1, width*2+1, width*2+2],
        [width, width*2, width+1, width+2]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const tTetromino = [
        [1, width, width+1, width+2],
        [1, width+1, width*2+1, width+2],
        [width, width+1, width+2, width*2+1],
        [1, width, width+1, width*2+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const sTetromino = [
        [1, 2, width, width+1],
        [0, width, width+1,width*2+1],
        [1, 2, width, width+1],
        [0, width, width+1,width*2+1]
    ];

    const zTetromino = [
        [0, 1, width+1, width+2],
        [2, width+1, width+2, width*2+1],
        [0, 1, width+1, width+2],
        [2, width+1, width+2, width*2+1]
    ];

    const theTetrominoes = [jTetromino, lTetromino, oTetromino, tTetromino, iTetromino, sTetromino, zTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    //隨機選一種圖形的第一種樣式
    let nextRandom = 0;
    let random = Math.floor(Math.random()*theTetrominoes.length);
    let current = theTetrominoes[random][currentRotation];
    
    //畫圖形
    function draw(){
        current.forEach(index =>{
            squares[currentPosition+index].classList.add('tetromino');
            squares[currentPosition+index].style.backgroundColor = color[random];
        });
    }

    //消除圖形
    function undraw(){
        current.forEach(index =>{
            squares[currentPosition+index].classList.remove('tetromino');
            squares[currentPosition+index].style.backgroundColor = '';
        });
    }

    //讓圖形每秒下降一次
    //timerId = setInterval(moveDown, 800);

    function control(event){
        if(event.keyCode == 37){
            moveLeft();
        }
        else if(event.keyCode == 38){
            rotate();
        }
        else if(event.keyCode == 39){
            moveRight();
        }
        else if(event.keyCode == 40){
            moveDown();
        }
    }
    document.addEventListener('keyup', control);

    //圖形下降
    function moveDown(){
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    //讓圖形停在最底部
    function freeze(){
        if(current.some(index => squares[currentPosition+index+width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition+index].classList.add('taken'));
            //畫一個新圖形
            random = nextRandom;
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            currentRotation = 0;
            draw();
            displayNext();
            addScore();
            gameOver();
        }
    }

    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition+index) % width == 0)
        if(!isAtLeftEdge)
            currentPosition -= 1;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition += 1;
        }
        draw();
    }

    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition+index) % width == width-1)
        if(!isAtRightEdge)
            currentPosition += 1;
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            currentPosition -= 1;
        }
        draw();
    }

    function rotate(){
        undraw();
        currentRotation ++;
        if(currentRotation == current.length){
            currentRotation = 0;
        }
        current = theTetrominoes[random][currentRotation];
        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],//j
        [0, 1, displayWidth+1, displayWidth*2+1],//l
        [0, 1, displayWidth, displayWidth+1],//o
        [1, displayWidth, displayWidth+1, displayWidth+2],//t
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],//i
        [1, 2, displayWidth, displayWidth+1],//s
        [0, 1, displayWidth+1, displayWidth+2]//z
    ];

    function displayNext(){
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex+index].classList.add('tetromino');
            displaySquares[displayIndex+index].style.backgroundColor = color[nextRandom];
        });
    }

    startBtn.addEventListener('click', ()=>{
        clearInterval(timerId);
        clearAll();
        timerId = null;
        timerId = setInterval(moveDown, 800);
        nextRandom = Math.floor(Math.random()*theTetrominoes.length);
        displayNext();
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
    });

    pauseBtn.addEventListener('click', ()=>{
        if(timerId){
            clearInterval(timerId);
            timerId = null;
        }
        else{
            timerId = setInterval(moveDown, 800);
        }
    });

    function addScore(){
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index =>{
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const removedSquares = squares.splice(i, width);
                squares = removedSquares.concat(squares);
                squares.forEach(cell =>{
                    grid.appendChild(cell);
                });
            }
        }
    }

    function gameOver(){
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))){
            gameDisplay.style.display = 'block';
            clearInterval(timerId);
            startBtn.style.display = 'block';
            pauseBtn.style.display = 'none';
        }
    }

    function clearAll(){
        for(let i = 0; i < 199; i++){
            if(squares[i].classList.contains('taken')){
                squares[i].classList.remove('taken');
                squares[i].classList.remove('tetromino');
                squares[i].style.backgroundColor = '';
                gameDisplay.style.display = 'none';
                score = 0;
                scoreDisplay.innerHTML = score;
            }
        }
    }

    const infoBtn = document.querySelector('#info');
    infoBtn.addEventListener('click', () => {
        const infoText = document.querySelector('.text');
        if(infoText.style.display == 'block'){
            infoText.style.display = 'none';
        }
        else{
            infoText.style.display = 'block'
        }
    });
});
