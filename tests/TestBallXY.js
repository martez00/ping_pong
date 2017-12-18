this.width=512;
this.height=256;
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

test_ball = new Ball();
test_ball.x = this.width/2;
test_ball.y = this.height/2;

console.log("Expected: 256–128")
console.log(test_ball.x);
console.log(test_ball.y);




