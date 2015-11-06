var canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d');

var cursor = new TextCursor(),
    drawingSurfaceImageData,
    blinkingInterval,
    BLINK_ON = 500,
    BLINK_OFF = 500,
    line,
    paragraph,
    str = "",
    initX = 0,
    initY = 0,
    interval,
    timer = 0,
    text3d,
    type = 0,
    count = 0;

context.fillStyle = 'red';

function Text3D()
{
    this.VPf = 260;
    this.centerx = canvas.width/6;
    this.centery = canvas.height/6;
    this.pnt = {};
    this.pnt1 = {};
    this.pnt2 = {};

    this.x = 0;
    this.y = 0;

    this.charList = [];
}

Text3D.prototype =
{
    init : function()
    {
        this.pnt = {};
        this.pnt1 = {};
        this.pnt2 = {};

        this.x = 0;
        this.y = 0;

        this.charList = [];
    },
    fsf : function(u, v, p)
    {
        if(type == 0)
        {
            if ( timer < 0 )
            {
                p.x = (u - 8)*11.5;
                p.y = (4-v)*12;
                p.z = 0;
            }
            else if ( timer <= 20 )
            {
                p.x = (u - 8)*11.5;
                p.y = (4 - v)*12;
                p.z = -timer * 10 - (4 - v)*timer;
            }
            else if ( timer <= 40 )
            {
                var x, z;
                x = (u - 8)*11.5;
                p.y = (4-v)*12;
                z = -(4-v)*20;
                p.x = x * Math.cos((timer-21)/6) - z * Math.sin((timer-21)/6);
                p.z = -200 + x * Math.sin((timer-21)/6) + z * Math.cos((timer-21)/6);
            }
            else if ( timer <= 60 )
            {
                p.x = (8-u)*11.5*(60-timer)/20 + (timer-40)/20*70*Math.sin((8-u)/6);
                p.y = (4-v)*12;
                p.z = -200 + (4-v)*(60-timer) - (timer-40)*3.5*Math.cos((8-u)/6);
            }
            else
            {
                var x = 70*Math.sin((8-u)/6);
                p.y = (4-v)*12;
                var z = -70*Math.cos((8-u)/6);
                p.x = x * Math.cos((timer-61)/6) - z * Math.sin((timer-61)/6);
                p.z = -200 + x * Math.sin((timer-61)/6) + z * Math.cos((timer-61)/6);
            }
        }
        else if(type == 1)
        {
            p.x = (u - 6) * 10;
            p.y = (4 - v) * 7 + Math.cos(Math.sqrt((u-8) * (u-8) + (3-v) * (3-v))/2 + timer/4) * 18;
            p.z = (v - 4) * 10;
        }
    },
    prf : function(p)
    {
        p.x = this.centerx + p.x * this.VPf / (this.VPf - p.z);
        p.y = this.centery - p.y * this.VPf / (this.VPf - p.z);
    },
    setText : function(str)
    {
        this.x = 0;
        this.y = 0;

        for(var i = 0; i < str.length; i++)
        {
            var char = new Char(str[i]);
            var ch = char.char;
            if(ch.charCodeAt() > 32)
            {
                char.u = this.x;
                char.v = this.y;
                this.x+=1;
                this.charList.push(char);
            }
            else if(ch == " ")
            {
                this.x+=1;
            }
            if(ch.charCodeAt() < 32)
            {
                this.y += 2;
                this.x = 0;
            }
        }
    },
    updateView : function()
    {
        timer+= 0.5;
        context.clearRect(0,0,canvas.width, canvas.height);

        for(var i = 0; i < this.charList.length; i++)
        {
            var char = this.charList[i];
            this.fsf(char.u, char.v, this.pnt);
            this.fsf(char.u, char.v + 1, this.pnt1);
            this.fsf(char.u + 1, char.v, this.pnt2);

            this.prf(this.pnt);
            this.prf(this.pnt1);
            this.prf(this.pnt2);

            char.setPos(this.pnt.x,                    this.pnt.y,
                    this.pnt1.x - this.pnt.x,      -this.pnt1.y + this.pnt.y,
                    this.pnt2.x - this.pnt.x,      -this.pnt2.y + this.pnt.y);

        }
    }
}

function Char(char)
{
    this.char = char;
    this.alpha = 0;
    this.phy = 0;
    this.sx = 0;
    this.sy = 0;

    this.px = 0;
    this.py = 0;

    this.k1 = 0;
    this.k2 = 0;
}

Char.prototype =
{
    setPos : function(px, py, a1, b1, a2, b2)
    {
        this.k1 = Math.atan2(b2-a1, a2+b1);
        this.k2 = Math.atan2(b2+a1, a2-b1);

        this.alpha = 0.5 * ( this.k1 + this.k2 );
        this.phy   = 0.5 * ( this.k1 - this.k2 );

        if ( Math.sin(this.k1) == 0 || Math.sin(this.k2) == 0 ) {
            this.sx = 0.5 * ((a2+b1) / Math.cos(this.k1) + (a2-b1) / Math.cos(this.k2));
            this.sy = 0.5 * ((a2+b1) / Math.cos(this.k1) - (a2-b1) / Math.cos(this.k2));
        } else {
            this.sx = 0.5 * ((b2-a1) / Math.sin(this.k1) + (b2+a1) / Math.sin(this.k2));
            this.sy = 0.5 * ((b2-a1) / Math.sin(this.k1) - (b2+a1) / Math.sin(this.k2));
        }

        context.save();

        context.scale(3,3);

        context.fillStyle = 'red';
        context.textAlign = 'center';
        context.textBaseline = 'bottom';

        context.translate(px, py);

        if(type == 0)
            context.scale(-this.sy / 24, this.sx / 24);
        else if(type == 1)
            context.scale(this.sx / 24, -this.sy / 24);

        context.fillText(this.char, 0, 0);
        context.restore();
    }
}

function setFont() {
    context.font = 50 + 'px ' + "Arial Black";
}

function saveDrawingSurface()
{
    drawingSurfaceImageData = context.getImageData(0, 0,
        canvas.width,
        canvas.height);
}

function init()
{
    text3d = new Text3D();
}

function update()
{
    text3d.updateView();
}

var isDown = false;

canvas.onmousedown = function(e)
{

   var loc = { x:100, y:150 },
        fontHeight,
        line;

    if(isDown == true)
    {
        if(paragraph.activeLine.text == "" && str == "")
        {
            alert("input text!");
            return;
        }

        if(str == "")
            str = paragraph.activeLine.text;

        type = (count++) % 2;
        text3d.setText(str);
        interval = setInterval(update, 1000 / 60);

        paragraph.erase(context, drawingSurfaceImageData);
        paragraph.clear();

        isDown = false;
        return;
    }
    else
    {
        isDown = true;

        clearInterval(interval);
        timer = 0;
        str = "";
        text3d.init();

        cursor.erase(context, drawingSurfaceImageData);
        saveDrawingSurface();

        fontHeight = context.measureText('W').width,
            fontHeight += fontHeight/6;

        paragraph = new Paragraph(context, loc.x, loc.y - fontHeight,
            drawingSurfaceImageData,
            cursor);

        paragraph.addLine(new TextLine(loc.x, loc.y));

    }
}

document.onkeydown = function(e)
{
    if(isDown == false) return;
    if(e.keyCode === 8 || e.keyCode === 13)
        e.preventDefault();

    if(e.keyCode === 8)
    {
        paragraph.backspace();

        str = str.substring(0, str.length - 1);
    }
    else if (e.keyCode === 13)
    {
        str += "\n";
        paragraph.newline();
    }
}

document.onkeypress = function(e)
{
    if(isDown == false) return;

    var key = String.fromCharCode(e.which);

    if(e.keyCode !== 8 && !e.ctrlKey && !e.metaKey)
    {
        e.preventDefault();

        paragraph.insert(key);

        str += key;
    }
}

setFont();
saveDrawingSurface();
init();