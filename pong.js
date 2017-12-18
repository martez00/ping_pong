//Template Method
class GameMechanism {
    constructor(){
        this.game = new Game();
        this.MainLoop();
    }
    MainLoop(){
        this.game.update();
        this.game.draw();
        setTimeout(this.MainLoop.bind(this), 33.3333);
    }
}

class GameMechanismSpeedX2 extends GameMechanism{
    constructor(){super();}
    MainLoop(){
        this.game.update();
        this.game.draw();
        setTimeout(this.MainLoop.bind(this), 15.3333);
    }
}

class GameMechanismSpeedX3 extends GameMechanism{
    constructor(){super();}
    MainLoop(){
        this.game.update();
        this.game.draw();
        setTimeout(this.MainLoop.bind(this), 10.3333);
    }
}

class Game {
    constructor() {
        var canvas = document.getElementById("game");
        this.width = canvas.width;
        this.height = canvas.height;
        this.context = canvas.getContext("2d");
        this.context.fillStyle = "yellow";
        this.keys = new KeyListener();
        this.paddle1 = new Paddle(5, 0);
        this.paddle1.y = this.height/2 - this.paddle1.height/2;
        this.display1 = new Display(this.width/4, 25);
        this.paddle2 = new Paddle(this.width - 7, 0);
        this.paddle2.y = this.height/2 - this.paddle2.height/2;
        this.display2 = new Display(this.width*3/4, 25);
        this.ball = new Ball();
        this.ball.x = this.width/2;
        this.ball.y = this.height/2;
        this.ball.directionY = Math.floor(Math.random()*12 - 6);
        this.ball.directionX = 7 - Math.abs(this.ball.directionY);
        this.abstractdraw = new AbstractDraw();
        this.drawing = new Draw();
        this.DrawingBallOrPaddle = new DrawBallOrPadle();
        this.DrawingDisplay = new DrawDisplay();
    }

    draw() {
        this.drawing.clear(this.context, 0, 0, this.width, this.height);
        this.drawing.fill(this.context, this.width/2, 0, 2, this.height);

        this.DrawingBallOrPaddle.fill(this.context, this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
        this.DrawingBallOrPaddle.fill(this.context, this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle2.height);
        this.DrawingBallOrPaddle.fill(this.context, this.ball.x, this.ball.y, this.ball.width, this.ball.height);

        this.DrawingDisplay.fill(this.context, this.display1.value, this.display1.x, this.display1.y);
        this.DrawingDisplay.fill(this.context, this.display2.value, this.display2.x, this.display2.y);
    }

    update(){
        this.ball.update();
        this.display1.value = this.paddle1.score;
        this.display2.value = this.paddle2.score;

        if (this.keys.isPressed(83)) {
            this.paddle1.y = Math.min(this.height - this.paddle1.height, this.paddle1.y + 4);
        } else if (this.keys.isPressed(87)) {
            this.paddle1.y = Math.max(0, this.paddle1.y - 4);
        }

        if (this.keys.isPressed(40)) {
            this.paddle2.y = Math.min(this.height - this.paddle2.height, this.paddle2.y + 4);
        } else if (this.keys.isPressed(38)) {
            this.paddle2.y = Math.max(0, this.paddle2.y - 4);
        }

        if (this.ball.directionX > 0) {
            if (this.paddle2.x <= this.ball.x + this.ball.width &&
                this.paddle2.x > this.ball.x - this.ball.directionX + this.ball.width) {
                var collisionDiff = this.ball.x + this.ball.width - this.paddle2.x;
                var k = collisionDiff/this.ball.directionX;
                var y = this.ball.directionY*k + (this.ball.y - this.ball.directionY);
                if (y >= this.paddle2.y && y + this.ball.height <= this.paddle2.y + this.paddle2.height) {
                    // susijungia su desiniu
                    this.ball.x = this.paddle2.x - this.ball.width;
                    this.ball.y = Math.floor(this.ball.y - this.ball.directionY + this.ball.directionY*k);
                    this.ball.directionX = -this.ball.directionX;
                }
            }
        } else {
            if (this.paddle1.x + this.paddle1.width >= this.ball.x) {
                var collisionDiff = this.paddle1.x + this.paddle1.width - this.ball.x;
                var k = collisionDiff/-this.ball.directionX;
                var y = this.ball.directionY*k + (this.ball.y - this.ball.directionY);
                if (y >= this.paddle1.y && y + this.ball.height <= this.paddle1.y + this.paddle1.height) {
                    //susijungia su kairiu
                    this.ball.x = this.paddle1.x + this.paddle1.width;
                    this.ball.y = Math.floor(this.ball.y - this.ball.directionY + this.ball.directionY*k);
                    this.ball.directionX = -this.ball.directionX;
                }
            }
        }

        if ((this.ball.directionY < 0 && this.ball.y < 0) ||
            (this.ball.directionY > 0 && this.ball.y + this.ball.height > this.height)) {
            this.ball.directionY = -this.ball.directionY;
        }
        if (this.ball.x >= this.width)
            this.score(this.paddle1);
        else if (this.ball.x + this.ball.width <= 0)
            this.score(this.paddle2);
    }
    score (player_scores){
        player_scores.score++;
        var player = player_scores == this.paddle1 ? 0 : 1;

        // set ball position
        this.ball.x = this.width/2;
        this.ball.y = player_scores.y + player_scores.height/2;

        this.ball.directionY = Math.floor(Math.random()*12 - 6);
        this.ball.directionX = (7 - Math.abs(this.ball.directionY));

        if (player_scores.x==5)
            this.ball.directionX*=-1;

    }
}

class Paddle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 2;
        this.height = 28;
        this.score = 0;
    }

    draw(p){
        p.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball{
    constructor() {
        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this.width = 4;
        this.height = 4;
    }
    update(){
        this.x += this.directionX;
        this.y += this.directionY;
    }
}

class Display {
    constructor (x, y){
        this.x = x;
        this.y = y;
        this.value = 0;
    }
    draw(p){
        p.fillText(this.value, this.x, this.y);
    }
}

class KeyListener{
    constructor(){
        this.pressedKeys = [];

        this.keydown = function(e) {
            this.pressedKeys[e.keyCode] = true;
        };

        this.keyup = function(e) {
            this.pressedKeys[e.keyCode] = false;
        };

        document.addEventListener("keydown", this.keydown.bind(this));
        document.addEventListener("keyup", this.keyup.bind(this));
    }

    isPressed(key){
        return this.pressedKeys[key] ? true : false;
    }
}

//AbstractFactory
class AbstractDraw {
    constructor(){}
    clear(){}
    fill(){}
}

class Draw extends AbstractDraw{
    constructor(){super();}

    clear(p, x, y, width, height){
        p.clearRect(x, y, width, height);
    }

    fill(p, x, y, width, height){
        p.fillRect(x, y, width, height);
    }
}

class DrawBallOrPadle extends AbstractDraw{
    constructor(){super();}
    
    fill(p, x, y, width, height){
        p.fillRect(x, y, width, height);
    }
}

class DrawDisplay extends AbstractDraw {
    constructor(){super();}
    fill(p, value, x, y){
        p.fillText(value, x, y);
    }
}

var masina = new GameMechanismSpeedX2();