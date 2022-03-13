const CELL_SIZE = 15;
const CANVAS_SIZE = 510;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    STOP: -1,
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

var MOVE_INTERVAL = 120;
var RESET_INTERVAL = 120;
var myObstacle;
var wallX = [];
var wallY = [];

var wall2 = [
    {
        x1: 5,
        x2: 28,
        y: 7,
    }
];
var wall3 = [
    {
        x1: 5,
        x2: 28,
        y: 14,
    }
];
var wall4 = [
    {
        x1: 5,
        x2: 28,
        y: 21,
    }
];
var wall5 = [
    {
        x: 5,
        y1: 7,
        y2: 28,
    },
    {
        x: 28,
        y1: 7,
        y2: 28,
    }
];


function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
        score: 0,
        scoreReset: 0,
        level: 1,
    }
}

let snake = initSnake("purple");

let apple1 = {
    position: initPosition(),
}

let apple2 = {
    position: initPosition(),
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake.color) {
        scoreCanvas = document.getElementById("scoreBoard");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "25px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function initWall2() {
    for (let i = 0; i < wall2.length; i++){
        for (let j = wall2[i].x1; j <= wall2[i].x2; j++) {
            wallX.push(j);
            wallY.push(wall2[i].y);
        }
    }
}

function initWall3() {
    for (let i = 0; i < wall3.length; i++){
        for (let j = wall3[i].x1; j <= wall3[i].x2; j++) {
            wallX.push(j);
            wallY.push(wall3[i].y);
        }
    }
}

function initWall4() {
    for (let i = 0; i < wall4.length; i++){
        for (let j = wall4[i].x1; j <= wall4[i].x2; j++) {
            wallX.push(j);
            wallY.push(wall4[i].y);
        }
    }
}

function initWall5() {
    for (let i = 0; i < wall5.length; i++){
        for (let j = wall5[i].y1; j <= wall5[i].y2; j++) {
            wallY.push(j);
            wallX.push(wall5[i].x);
        }
    }
}

function createWall() {
    let wallCanvas = document.getElementById("snakeBoard");
    let ctx = wallCanvas.getContext("2d");
    for (let i = 0; i < wallX.length; i++) {
        drawCell(ctx, wallX[i], wallY[i], "#808080");
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        drawCell(ctx, snake.head.x, snake.head.y, snake.color);
        for (let i = 1; i < snake.body.length; i++) {
            drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
        }

        let img = document.getElementById("apple");
        ctx.drawImage(
            img,
            apple1.position.x * CELL_SIZE,
            apple1.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );
          ctx.drawImage(
            img,
            apple2.position.x * CELL_SIZE,
            apple2.position.y * CELL_SIZE,
            CELL_SIZE,
            CELL_SIZE
          );

        createWall();

        document.getElementById("level").innerHTML = "Snake Game - Level: " + snake.level;
        document.getElementById("score").innerHTML = "Score";
        drawScore(snake);
        document.getElementById("speed").innerHTML = "Speed " + MOVE_INTERVAL + " ms";

    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple1, apple2) {

    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
        snake.scoreReset++;
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }
    if (snake.head.x == apple2.position.x && snake.head.y == apple2.position.y) {
        apple2.position = initPosition();
        snake.score++;
        snake.scoreReset++;
        snake.body.push({ x: snake.head.x, y: snake.head.y });
    }

    while (snake.scoreReset === 5) {
        if (snake.level <= 4) {
            if (snake.level == 1) {
                initWall2();
            }
            else if (snake.level == 2) {
                initWall3();
            }
            else if (snake.level == 3) {
                initWall4();
            }
            else if (snake.level == 4) {
                wallX = [];
                wallY = [];
                initWall5();
            }
            snake.level++;
            MOVE_INTERVAL -= 15;
            alert("Level Up - Level: " + snake.level);
        }
        snake.scoreReset = 0;
    }

}

function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveStop(snake) {
    snake.direction = DIRECTION.STOP;
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
                
            }
        }
    }

    for (let i = 0; i < wallX.length; i++) {
        if (snake.head.x === wallX[i] && (snake.direction == 2 || snake.direction == 3)) {
            if (snake.head.y === wallY[i] || snake.head.y === wallY[i]) {
                wallX = [];
                wallY= [];
                isCollide = true;
            }
        }
        if (snake.head.y === wallY[i] && (snake.direction == 0 || snake.direction == 1)) {
            if (snake.head.x === wallX[i] || snake.head.x === wallX[i]) {
                wallX = [];
                wallY= [];
                isCollide = true;
            }
        }
    } 

    for (let i = 0; i < wallX.length; i++) {
        if (apple1.position.x === wallX[i]) {
            if (apple1.position.y === wallY[i] || apple1.position.y === wallY[i]) {
                apple1.position = initPosition();
            }
        }
        if (apple1.position.y === wallY[i]) {
            if (apple1.position.x === wallX[i] || apple1.position.x === wallX[i]) {
                apple1.position = initPosition();
            }
        }
    }  

    if (isCollide) {
        alert("Game over - You get score " + snake.score);
        MOVE_INTERVAL = RESET_INTERVAL;
        snake = initSnake("purple");
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}

function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake, DIRECTION.DOWN);
    }
})

function initGame() {
    move(snake);
}

initGame();