// Name: Mainah Folkers
// Student number: 10535845

// array with labels for y axis of bar chart
var yLabels = [];

// dictionairies with map data for different species
var totals = {},
    birds = {},
    mammals = {},
    fish = {},
    plants = {};

// maximum values of corresponding map data
var totalMax,
    birdMax,
    mammalMax,
    fishMax,
    plantMax;

// initial bar chart data
var globalData = [];

// load data from csv
d3.csv("data.csv", function(data) {
    // find maximum value in data
    totalMax = d3.max(data, function(d) { return Math.max(+d.total); });
    birdMax = d3.max(data, function(d) { return Math.max(+d.bird); });
    mammalMax = d3.max(data, function(d) { return Math.max(+d.mammal); });
    fishMax = d3.max(data, function(d) { return Math.max(+d.fish); });
    plantMax = d3.max(data, function(d) { return Math.max(+d.plant); });

    // get y labels from keys of data dictionairy
    yLabels = Object.keys(data[0]);
    yLabels = yLabels.slice(2, 7);

    // set the initial bar chart data to sum of all values in data by key
    globalData[0] = d3.sum(data, function(d) { return +d.bird; });
    globalData[1] = d3.sum(data, function(d) { return +d.mammal; });
    globalData[2] = d3.sum(data, function(d) { return +d.fish; });
    globalData[3] = d3.sum(data, function(d) { return +d.plant; });

    // transform data to format required by datamaps.js
    // fillColor is determined by species, which is an y label
    data.forEach(function(d) {
        totals[d.iso] = {
            value: +d.total,
            fillColor: color(yLabels[4], totalMax, +d.total)
        };
        birds[d.iso] = {
            value: +d.bird,
            fillColor: color(yLabels[0], birdMax, +d.bird)
        };
        mammals[d.iso] = {
            value: +d.mammal,
            fillColor: color(yLabels[1], mammalMax, +d.mammal)
        };
        fish[d.iso] = {
            value: +d.fish,
            fillColor: color(yLabels[2], fishMax, +d.fish)
        };
        plants[d.iso] = {
            value: +d.plant,
            fillColor: color(yLabels[3], plantMax, +d.plant)
        };
    });

    // initial map and barchart are drawn
    drawMap(yLabels[4], totalMax, totals);
    drawChart(globalData, "World");
});

// function to set map color scale by species
var color = function(species, max, value) {
    var minColor,
        maxColor;
    if (value == 0)
    {
        return "white";
    }
    else
    {
        if (species == "total") {
        minColor = "#fee0d2";
        maxColor = "#cb181d";
        }
        else if (species == "bird") {
            minColor = "#dadaeb";
            maxColor = "#6a51a3";
        }
        else if (species == "mammal") {
            minColor = "#fee6ce";
            maxColor = "#7f2704";
        }
        else if (species == "fish") {
            minColor = "#deebf7";
            maxColor = "#2171b5";
        }
        else if (species == "plant") {
            minColor = "#e5f5e0";
            maxColor = "#238b45";
        }
        var fillColor = d3.scale.linear().range([minColor, maxColor])
            .domain([0, max]);
        return fillColor(value);
    }
};

// function to draw map
var drawMap = function(species, max, data) {
    // remove old map and legend
    d3.select(".datamap").remove();
    d3.selectAll("#container div").remove();

    // adjust header to selected species data
    var speciesName = function(species) {
        if (species != "total")
        {
            return species;
        }
        else
        {
            return "";
        }
    }
    d3.select("h1")
        // adjust header to graph
        .text("Amount of threatened " + speciesName(species) + " species (2015)");

    var map = new Datamap({
        scope: "world",
        element: document.getElementById("container"),
        // flat projection of globe
        projection: "mercator",
        fills: {
            defaultFill: "grey",
            zero: "white",
            low: color(species, max, max * 0.25),
            medium: color(species, max, max * 0.5),
            high: color(species, max, max * 0.75),
            extreme: color(species, max, max)
        },
        data: data,
        geographyConfig: {
            borderColor: "black",
            // the color is not changed when highlighted
            highlightFillColor: function(d) { return color(+d.value); },
            highlightBorderColor: "red",
            highlightBorderWidth: 2,
            popupTemplate: function(geo, data) {
                // if country is represented in data
                if (data.value != null){
                    // show value in tooltip
                    return ['<div class="hoverinfo"><strong>',
                            geo.properties.name,
                            ': ' + data.value,
                            '</strong></div>'].join('');
                }
                else {
                    // show unknown in tooltip
                    return ['<div class="hoverinfo"><strong>',
                            geo.properties.name,
                            ': unknown</strong></div>'].join('');
                }
            }
        },
        done: function(map) {
            // ad click event listener to all countries on map
            map.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                var localName = geo.properties.name,
                    localData = [birds[geo.id].value, mammals[geo.id].value, fish[geo.id].value, plants[geo.id].value];
                // when clicked draw chart with name and data of country
                drawChart(localData, localName);
            })
        }
    });

    // create map legend
    map.legend({
        defaultFillName: "unknown",
        // label values are rounded upwards to next integer
        labels: {
            zero: '0',
            low: '< ' + Math.ceil(max * 0.25),
            medium: '< ' + Math.ceil(max * 0.5),
            high: '< ' + Math.ceil(max * 0.75),
            extreme: '< ' + (max + 1)}
    });
};

// function to draw bar chart
var drawChart = function(data, country) {
    // remove old bar chart
    d3.select(".chart").remove();

    var margin = {top: 60, left: 70, bottom: 20},
        width = 400 - margin.left,
        height = 500 - margin.top - margin.bottom;

    var y = d3.scale.linear()
        .range([height, 0]);

    var chart = d3.select(".wrapper").append("svg")
        .attr("class", "chart")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left);

    // adjust chart title to selected country
    chart.append("text")
        .attr("class", "chartTitle")
        .attr("x", width / 2 + margin.left)
        .attr("y", margin.top / 2)
        .text(country);

    // determine maximum value of bar chart data
    var max = d3.max(data, function(d) { return Math.max(d); });
    y.domain([0, max]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var barWidth = width / data.length,
        bar = chart.selectAll("g")
          .data(data)
          .enter().append("g")
          // alignes bar at right position, next of each other
          .attr("transform", function(d, i) {
              return "translate(" + (margin.left + (barWidth * i)) + ", " + margin.top +")"; });

    bar.append("rect")
        // give bars class corresponding to species and y label
        .attr("class", function(d, i) { return yLabels[i]})
        .attr("width", barWidth - 1)
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return height - y(d); })
        .attr("xPosition", function(d, i) { return i * barWidth; })
        // fill bar according to species
        .style("fill", function(d, i) { return color(yLabels[i], max, max); })
        // if mouse hovers over bar
        .on("mouseover", function(d) {
            // get this bar's x values then augment for the tooltip
			var xPosition = parseFloat(d3.select(this).attr("xPosition"));
            var yPosition = parseFloat(d3.select(this).attr("height"));

            // create the tooltip label
            chart.append("text")
                .attr("class", "tooltip")
                .attr("x", xPosition + margin.left + barWidth / 2)
                .attr("y", height - yPosition + margin.top - 5)
                .text(d);
        })
        // if mouse no longer hovers over bar
        .on("mouseout", function() {
            // remove the tooltip
            d3.select(".tooltip").remove();
        })
        .on("click", function() {
            // get class of bar that is clicked
            var species = d3.select(this).attr("class");
            var pickData = function(species) {
                if (species == "bird") {
                    return [birdMax, birds] ;
                }
                else if (species == "mammal") {
                    return [mammalMax, mammals];
                }
                else if (species == "fish") {
                    return [fishMax, fish];
                }
                else if (species == "plant") {
                    return [plantMax, plants];
                }
            };
            // determine data for map adjusted to selected species
            var mapData = pickData(species);
            drawMap(species, mapData[0], mapData[1]);
        })

    // append yLabels in bars
    bar.append("text")
      .attr("class", "yLabel")
      .attr("x", barWidth / 2)
      .attr("y", height + margin.bottom - 5)
      .text(function(d, i) { return yLabels[i]; });

    chart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin.left +", " + margin.top + ")")
      .call(yAxis);
};

// when button is clicked, draw inital chart and map
d3.select("button").on("click", function(){
    drawChart(globalData, "World");
    drawMap(yLabels[4], totalMax, totals);
});
