// Name: Mainah Folkers
// Student number: 10535845

// function to parse date in date format into javascript Date object
var parseDate = d3.time.format("%Y%m%d").parse,
    // funciton to get index of item left of where date should be inserted in data
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    // function to format date in day number and month
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

// function to determine color of line
var color = d3.scale.ordinal()
    .range(["#4d4d4d", "#2166ac", "#b2182b"]);

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
    .y(function(d) { return y(d.temperature); });

var render = function(){
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

        graph.append("g")
            .attr("class", "x axis")

        graph.append("g")
            .attr("class", "y axis")

        graph.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            // listen for all pointer event on this rectangle
            .style("pointer-events", "all")

        var legend = graph.append("g")
        	.attr("class","legend")
        	.attr("x", width - margin.right)
        	.attr("y", margin.top)
        	.attr("height", 100)
        	.attr("width", 100);

        var legendLabels = ["min temp", "avg temp", "max temp"];

        legend.selectAll("g")
            .data(legendLabels)
            .enter().append("g")
            .each(function(d,i){
                var g = d3.select(this);
                g.append("rect")
                .attr("x", width - margin.right)
                .attr("y", i*25 + 10)
                .attr("width", 10)
                .attr("height",10)
                .style("fill", color(color.domain()));

                g.append("text")
                    .attr("x", width - margin.right)
                    .attr("y", i*25 + 20)
                    .text(function(d) { return d; });
            });
};

// on click, update header and graph
d3.selectAll("button")
	.on("click", function() {
        // get name of place
        var name = this.getAttribute("value");
        // get right csv file
        var csv = name + ".csv";

        d3.select("h1")
            // adjust header to graph
            .text("Temperature in " + name + " (2015)");

        drawGraph(csv);
});

var drawGraph = function(csv) {
    // remove old graph
    d3.select("svg").remove();
    d3.selectAll(".tooltip").remove();

    // render new graph
    render();

    // load data from csv
    d3.csv(csv, function(data) {
        data.forEach(function(d) {
            // transform date into javascript Date object
            d.date = parseDate(d.date);
            // transform temperature into degrees
            d.TN = +d.TN / 10;
            d.TG = +d.TG / 10;
            d.TX = +d.TX / 10;
        });

        // define domain of line color with column names of data
        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

        var temperatures = color.domain().map(function(temp) {
            return {
              line: temp,
              values: data.map(function(d) {
                return {date: d.date, temperature: +d[temp]};
              })
            };
          });

        // determine domain for x and y axis, extent returns min and max value of data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([
            d3.min(temperatures, function(t) {
                return d3.min(t.values, function(v) {
                    return Math.min(v.temperature);
                });
            }),
            d3.max(temperatures, function(t) {
                return d3.max(t.values, function(v) {
                    return Math.max(v.temperature);
                });
            })
          ]);

          var graph = d3.select("g");
          var overlay = d3.select("g.overlay")

        graph.select("g.x.axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "axisTitle")
            .attr("dy", margin.bottom)
            .attr("dx", width / 2)
            .text("Months");

        graph.select("g.y.axis")
            .call(yAxis)
            .append("text")
            .attr("class", "axisTitle")
            .attr("transform", "rotate(-90)")
            .attr("dy", -margin.left / 2)
            .style("text-anchor", "end")
            // temperature in degree Celsius with utf-8 degree character
            .text("Temperature (\xB0C)");

        graph.selectAll(".temperature")
            .data(temperatures)
            .enter().append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.line); });

        overlay.selectAll("circle")
            .data(temperatures)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("id", function(d) { return d.line});

        // append interactive tooltip to overlay
        var tooltip = d3.select("body").selectAll("div.tooltip")
            .data(d3.keys(data[0]))
            .enter().append("div")
            .attr("class", "tooltip")
            .attr("id", function(d) { return d});

        graph.select("rect")
            // activates overlay and tooltips
            .on("mouseover", function() {
                overlay.style("display", null);
                tooltip.style("display", null);
            })
            // deactivates overlay and tooltips
            .on("mouseout", function() {
                overlay.style("display", "none");
                tooltip.style("display", "none");
            })
            // transfroms location of interactive dot to mouse x position and associated y value
            .on("mousemove", function() {
                // translates mouse x position to associated date
                var xMouse = x.invert(d3.mouse(this)[0]),
                    // returns index of date in data
        		    index = bisectDate(data, xMouse);

                // adjusts position of dots to x and y value of associated data
    		    overlay.selectAll("circle").attr("cx", x(xMouse));
                overlay.select("#TG").attr("cy", y(data[index].TG));
                overlay.select("#TN").attr("cy", y(data[index].TN));
                overlay.select("#TX").attr("cy", y(data[index].TX));

                // fill tooltips with values and position absolute on page
                d3.selectAll("div.tooltip").style("left", (d3.event.pageX + 4) + "px");
                d3.select("div#date").html(formatDate(data[index].date))
                    .style("top", (height + 140) + "px");
                d3.select("div#TG").html(data[index].TG + " \xB0C")
                    .style("top", (y(data[index].TG) + 110) + "px");
                d3.select("div#TN").html(data[index].TN + " \xB0C")
                    .style("top", (y(data[index].TN) + 110) + "px");
                d3.select("div#TX").html(data[index].TX + " \xB0C")
                    .style("top", (y(data[index].TX) + 110) + "px");
            })
    });
};
