// Name: Mainah Folkers
// Student number: 10535845

// function to parse date in date format into javascript Date object
var parseDate = d3.time.format("%Y%m%d").parse,
    // funciton to get index of item left of where date should be inserted in data
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatDate = d3.time.format("%e %B");

// set margins
var margin = {top: 20, right: 20, bottom: 40, left: 50},
    width = 1100 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// determine range for x axis
var x = d3.time.scale()
    .range([0, width]);

// determine range for y axis
var y = d3.scale.linear()
    .range([height, 0]);

// scale x axis and place at bottom of graph
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    // format labels of x axis to day number and month
    .tickFormat(formatDate);

// scale y axis and place at left of graph
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    // scale x values of line
    .x(function(d) { return x(d.date); })
    // scale y values of line
    .y(function(d) { return y(d.TG); });

var graph = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // append drawing surface for line of graph
    .append("g")
    // position drawing surface inside of margins
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// append transparant overlay for interactive dot
var overlay = graph.append("g")
    .attr("class", "overlay")
    .style("display", "none");

// append interactive dot to overlay
var dot = overlay.append("circle")
    .attr("r", 3.5);

// append interactive tooltip to overlay
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

// load data from csv
d3.csv("d3line.csv", function(data) {
    data.forEach(function(d) {
        // transform date into javascript Date object
        d.date = parseDate(d.date);
        // transform temperature into degrees
        d.TG = +d.TG / 10;
    });

    // determine domain for x and y axis, extent returns min and max value of data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.TG; }));

    graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "axisTitle")
        .attr("dy", margin.bottom)
        .attr("dx", width / 2)
        .text("Months");

    graph.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "axisTitle")
        .attr("transform", "rotate(-90)")
        .attr("dy", -margin.left / 2)
        .style("text-anchor", "end")
        // temperature in degree Celsius with utf-8 degree character
        .text("Temperature (\xB0C)");

    graph.append("path")
        .datum(data)
        .attr("class", "line")
        // define shape of path
        .attr("d", line);

    graph.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        // listen for all pointer event on this rectangle
        .style("pointer-events", "all")
        // activates transparant overlay
        .on("mouseover", function() {
            overlay.style("display", null);
            tooltip.style("display", null);
        })
        // deactivates overlay
        .on("mouseout", function() {
            overlay.style("display", "none");
            tooltip.style("display", "none");
        })
        // transfroms location of interactive dot to mouse x position and associated y value
        .on("mousemove", function() {
            // translates mouse x position to associated date
            var xMouse = x.invert(d3.mouse(this)[0]),
                // returns index of date in data
    		    index = bisectDate(data, xMouse),
                // associated data with index
    		    d = data[index];

            // adjusts position of circle to x and y vaue of associated data
		    dot.attr("transform", "translate(" + x(d.date) + "," + y(d.TG) + ")");

            // fill tooltip with values
            tooltip.html(formatDate(d.date) + "</br>" + d.TG + " \xB0C")
                // positions tooltip absolute on page
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (y(d.TG) + margin.top + margin.bottom - 10) + "px");
        })
});
