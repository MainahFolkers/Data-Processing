// data is loaded
var data = document.getElementById("rawdata").innerHTML;
// and split into lines
data = data.split("\n");

for (var i = 0; i < data.length - 1; i++)
{
    // white space is deleted from data and date and temperature are seperated in strings
    data[i] = data[i].replace(/\s/g, "").split(';');
    // date string is transformed to JavaScript Date
    data[i][0] = new Date(data[i][0]);
    // temperature is transformed to JavaScript Number
    data[i][1] = Number(data[i][1]);
}

// canvas for graph is created
var canvas = document.getElementById("graph");
// canvas size is adjusted to browser size
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// contex for graph is created
var ctx = canvas.getContext("2d");

// text font and width are documented and graph title is placed top middle of graph
ctx.font = "48px serif";
var title = ctx.measureText("Average Temperature in the Bilt (NL) 2015");
ctx.fillText("Average Temperature in the Bilt (NL) 2015", (canvas.width-title.width)/2, 50, canvas.width);

// axes are drawn
ctx.beginPath();
ctx.moveTo(100,100);
// y-axis is drawn
ctx.lineTo(100,canvas.height - 100);
// x-axis is drawn
ctx.lineTo(canvas.width - 100, canvas.height - 100);
ctx.stroke();

// domains and ranges are given for graph axis
var xAxis = createTransform([data[0][0], data[data.length - 2][0]],[100, canvas.width - 100]);
var yAxis = createTransform([-50,300],[canvas.height - 100, 0]);

// label y-axis
for (var i = -50; i < 300; i += 50)
{
    ctx.beginPath();
    ctx.moveTo(100, yAxis(i));
    ctx.lineTo(80, yAxis(i));
    ctx.stroke();
    // labels x-axis with temperature in Celsius degrees
    ctx.fillText(i / 10, 10, yAxis(i) + 10);
}

// label x-axis
for (var i = 0; i < 364; i++)
{
    var date = data[i][0].getDate();
    if (date == 1)
    {
        ctx.beginPath();
        ctx.moveTo(xAxis(data[i][0]), canvas.height - 100);
        ctx.lineTo(xAxis(data[i][0]), canvas.height - 80);
        ctx.stroke();
        ctx.font = "24px serif";
        ctx.save();
        // sets base point for rotation
        ctx.translate(xAxis(data[i][0]) - 50, canvas.height - 25);
        // rotates text from base point
        ctx.rotate(-35 * Math.PI / 180);
        // represent date as calander string and remove weekday
        ctx.fillText(data[i][0].toDateString().slice(4, -4), 0, 0);
        ctx.restore();
    }
}

ctx.beginPath();
// moves to first data point of graph line
ctx.moveTo(100, yAxis(data[0][1]));

var x = [];
var y = [];

for (var i = 0; i < data.length-1; i++)
{
    // dates are transformed to x coordinates from miliseconds after 1 jan 1970 UTC
    x[i] = xAxis(data[i][0].getTime());
    // temperatures are transformed to y coordinates
    y[i] = yAxis(data[i][1]);
    ctx.lineTo(x[i], y[i]);
}
// graph line is drawn
ctx.stroke();

// transforms data points to pixel points on screen
function createTransform(domain, range){
    var alpha = (range[1] - range[0]) / (domain[1] - domain[0]);
    var beta = range[1] - (alpha * domain[1]);

    return function(x){
        return alpha * x + beta;
    };
}
