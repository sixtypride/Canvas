var canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d');

var hsp = 4,
    total = 30,
    twidth = (total - 1) * hsp,
    brmin = 30,
    brmax = 40,
    balls = [];

function inc(val) { return 3; }
function yMag(val) { return 1; }
function minScale(val) { return 20; }
function maxScale(val) { return 30; }
function startDegree(val) { return 9 * val; }

function Ball()
{
    this.offset = 0;
    this.x = 0;
    this.y = 0;
    this.baseY = canvas.height/2;
    this.xscale = this.yscale = minScale();
    this.inc = inc(this.offset);
    this.brmin = brmin;
    this.brmax = brmax;
    this.degree = startDegree(this.offset);
    this.brvariation = this.brmax - this.brmin;
    this.yMag = yMag(this.offset);
    this.minscale = minScale(this.offset);
    this.maxscale = maxScale(this.offset);
    this.variation = this.maxscale - this.minscale;
}

Ball.prototype =
{
    change : function()
    {
        this.degree += this.inc;
        var value = Math.sin(this.degree * Math.PI / 180);
        this.xscale = this.yscale = this.minscale + (this.variation/2) + (this.variation/2) * value;
        this.y = this.baseY + value * this.yMag;
    },

    render : function()
    {
        context.beginPath();
        context.arc(this.x, this.y, this.xscale, 0, Math.PI * 2, false);
        context.fillStyle = "red";
        context.fill();
    }
}

function render()
{
    if(balls.length < total)
    {
        createBall(balls.length);
    }

    context.clearRect(0,0,canvas.width, canvas.height);
    balls.forEach(function(ball)
    {
        ball.change();
        ball.render();
    })
}

function createBall(idx)
{
    var ball = new Ball();
    balls.push(ball);
    ball.offset = Math.abs((total/2) - idx);
    ball.x = (canvas.width - twidth)/2 - hsp * idx;
    ball.y = canvas.height/2;
}

function init()
{
//    for(var i = 0; i < total; i++)
//    {
//        createBall(i);
//    }

    setInterval(render, 1000 / 60);
}

init();
