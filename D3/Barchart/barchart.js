// Name: Mainah
// Student number: 10535845

// loads csv into dictionary
var data = d3.csv("barchart.csv", function(d) {
    data = d[0];
    console.log(data);
    return data;
});
