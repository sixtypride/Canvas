var canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d');
var balls = [];
var isInc = true;


function Ball()
{
    this.radius = 10;

}

Ball.prototype =
{
    render : function()
    {
        context.save();

        context.translate(100, 100);
        context.rotate(Math.PI/6);
        context.scale(2,2);

        context.beginPath();
        context.rect(-50, -50, 100, 100);

        //context.scale(2,2);
        //this.color = 'rgba(' + (Math.random()*255).toFixed(0) + ', ' + (Math.random()*255).toFixed(0) + ', ' + (Math.random()*255).toFixed(0) + ', 1.0)';
        //context.fillStyle = this.color;
        context.fill();

        context.restore();
    }
}

function render()
{
    if(balls.length < 1)
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
