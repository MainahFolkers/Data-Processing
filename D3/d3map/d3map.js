// Name: Mainah Folkers
// Student number: 10535845

// set color scale with 4 discrete colors
var color = d3.scale.quantize()
    .range(['#fef0d9','#fdcc8a','#fc8d59','#d7301f']);

// load data from csv
d3.csv("d3map.csv", function(data) {
    // find maximum value in data
    var max = d3.max(data, function(d) { return Math.max(+d.value); });
    // set domain for color scaling
    color.domain([0, max]);

    var countries = {};
    // transform data to format required by datamaps.js
    data.forEach(function(d){
        countries[d.iso] = {
            value: +d.value,
            // fill color is determined by color scale
            fillColor: color(+d.value)
        };
    });

    var map = new Datamap({
        scope: "world",
        element: document.getElementById("container"),
        // flat projection of globe
        projection: "mercator",
        fills: {
            defaultFill: "black",
            low: color(0),
            medium: color(max * 0.25),
            high: color(max * 0.5),
            extreme: color(max * 0.75)
        },
        data: countries,
        geographyConfig: {
            // the color is not changed when highlighted
            highlightFillColor: function(d){return color(+d.value);},
            highlightBorderColor: "black",
            highlightBorderWidth: 1,
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
                    // show unknow in tooltip
                    return ['<div class="hoverinfo"><strong>',
                            geo.properties.name,
                            ': unknown</strong></div>'].join('');
                }
            }
        }
    });

    map.legend({
        defaultFillName: "unknown",
        // label values are rounded upwards to next integer
        labels: {
            low: '< ' + Math.ceil(max*0.25),
            medium: '< ' + Math.ceil(max*0.5),
            high: '< ' + Math.ceil(max*0.75),
            extreme: '< ' + (max + 1)}
    });
});
