// Name: Mainah Folkers
// Student number: 10535845

var barHeight = 40;
var width = 1100;
var margin = 50;

// function to transform bar width to svg coordinates
var x = d3.scale.linear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width)

// load data from csv
d3.csv("barchart.csv", function(data) {
    var max = d3.max(data, function(d) { return Math.max(+d.value); });
    // determine domain by maximum value in data plus 100
    x.domain([0, max + 100]);

    // determine height by sum of all bar heights and margin
    var height = (barHeight * data.length) + margin;
    chart.attr("height", height);

    // sort data from smallest to largest value
    data.sort(function (a, b) {
        if (a.value > b.value) {
            return 1;
        }
        if (a.value < b.value) {
            return -1;
        }
        return 0;
    });

    // saves provinces in array
    var yLabels = [];
    for (var i = 0; i < data.length; i++)
    {
        yLabels[i] = data[i].province;
    }

    var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      // alignes bar at right position, on top of each other
      .attr("transform", function(d, i) {
          return "translate(" + margin + "," + i * barHeight + ")"; })
    // append bars to chart
    bar.append("rect")
        .attr("width", function(d) { return x(d.value); })
        // leave 1px between bars
        .attr("height", barHeight - 1)
        .attr("yPosition", function(d, i) { return i * barHeight; })
        // if mouse hovers over bar
        .on("mouseover", function(d) {
            // get this bar's x/y values, then augment for the tooltip
			var xPosition = parseFloat(d3.select(this).attr("width"));
			var yPosition = parseFloat(d3.select(this).attr("yPosition"));

            // create the tooltip label
            chart.append("text")
            .attr("class", "tooltip")
            .attr("x", xPosition)
            .attr("y", yPosition)
            .attr("dx", 5)
            .attr("dy", 25)
            .text(d.value);
        })
        // if mouse no longer hovers over bar
        .on("mouseout", function() {
            // remove the tooltip
            d3.select(".tooltip").remove();
        });

    // append y-axis title
    chart.append("text")
        .attr("class", "yTitle")
        // rotate text vertical
        .attr("transform", "rotate(-90)")
        .attr("y", margin / 2)
        .style("text-anchor", "end")
        .text("Province");

    // append x-axis title
    chart.append("text")
        .attr("class", "xTitle")
        .attr("y", height - 5)
        .attr("x", width / 2)
        .text("kg per capita");

    // append yLabels in bars
    bar.append("text")
      .attr("class", "yLabel")
      .attr("x", 5)
      .attr("y", barHeight / 2)
      .attr("dy", ".10em")
      .text(function(d) { return d.province; });

    // create x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    chart.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(" + margin + ", " + (height - margin) + ")")
        .call(xAxis);
});
