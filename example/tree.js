var canvas = document.getElementById("canvas"),
    context = canvas.getContext('2d');

var drawTree = function(ctx, startX, startY, length, angle, depth, branchWidth) {
    var rand = Math.random,
        newLength, newAngle, newDepth, maxBranch = 3,
        endX, endY, maxAngle = 2 * Math.PI * 4,
        subBranches, lenShrink;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    endX = startX + length * Math.cos(angle);
    endY = startY + length * Math.sin(angle);
    ctx.lineCap = 'round';
    ctx.lineWidth = branchWidth;
    ctx.lineTo(endX, endY);

    if(depth <= 2) {
        ctx.strokeStyle = 'rgb(0,' + (((rand() * 64) + 128) >> 0) + ',0)';
    }
    else {
        ctx.strokeStyle = 'rgb(0,' + (((rand() * 64) + 64) >> 0) + ',50,25)';
    }
    ctx.stroke();

    newDepth = depth - 1;

    if(!newDepth) {
        return;
    }

    subBranches = (rand() * (maxBranch - 1)) + 1;
    branchWidth *= 0.7;

    for(var i = 0; i < subBranches; i++) {
        newAngle = angle + rand() * maxAngle - maxAngle * 0.5;
        newLength = length * (0.7 + rand() * 0.3);
        drawTree(ctx, endX, endY, newLength, newAngle, newDepth, branchWidth);
    }
}

drawTree(context, 320,470,60, -Math.PI / 2, 10,10);



