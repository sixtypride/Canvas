var canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d');
var balls = [];
var isInc = true;


function Ball()
{
    alert(this);
    this.radius = 10;
    this.color = 'rgba(' + (Math.random()*255).toFixed(0) + ', ' + (Math.random()*255).toFixed(0) + ', ' + (Math.random()*255).toFixed(0) + ', 1.0)';
    this.color = 'red';
    this.scaleSpeed = 1.011;
    this.lrSpeed = 10 + Math.random() * 10;
    this.hRad = Math.random() * 4;
    this.vRad = Math.random() * 4;
    this.hRadInc = Math.random() * 4;
    this.vRadInc = Math.random() * 4;
    this.lr = 0;
}

Ball.prototype =
{
    render : function()
    {
        if(isInc)
        {
            if(this.radius < 100)
            {
                this.lr += this.lrSpeed;
                this.radius += this.scaleSpeed;
                this.hRad += this.hRadInc;
                this.vRad += this.vRadInc;
            }
        }
        else
        {
            if(this.radius > 10)
            {
                this.lr -= this.lrSpeed;
                this.radius -= this.scaleSpeed;
                this.hRad -= this.hRadInc;
                this.vRad -= this.vRadInc;
            }
        }

        this.x = (canvas.width / 2) + this.hRad * Math.sin(this.lr * Math.PI /180);
        this.y = (canvas.height / 2) + this.vRad * Math.cos(this.lr * Math.PI /180);

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

function render()
{
    if(balls.length < 100)
    {
        createBall();
    }
    context.clearRect(0,0,canvas.width, canvas.height);
    balls.forEach(function(ball)
    {
        ball.render();
    })
}
function createBall()
{
    var ball = new Ball();
    balls.push(ball);
}

function init()
{
    setInterval(render, 1000 / 60);
}

init();
