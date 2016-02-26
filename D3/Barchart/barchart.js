// Name: Mainah
// Student number: 10535845

var data = d3.csv("barchart.csv", function(d) {
    data = d[0];
    console.log(data);
    return data;
});
