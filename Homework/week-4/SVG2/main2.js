// Name: Mainah
// Student number: 10535845

// when window is loaded
window.onload = function() {
    // iterate over data
    for (var i = 0; i < data.length; i++)
    {
        //iterates over country codes
        for (var j = 0; j < countries.length; j++) {
            // if 3 letter country code matches
            if (data[i][0] == countries[j][1]) {
                // choose color category
                var color = determineColor(data[i][1]);
                // fill country with determined color
                changeColor(countries[j][0], color);
            }
        }
    }
}

/* determineColor takes a data value
   and determines a color from the scheme */
function determineColor(value){
    if (value < 45){
        return "#fef0d9"
    }
    else if (value >= 45 && value < 90) {
        return "#fdcc8a"
    }
    else if (value >= 90 && value < 135) {
        return "#fc8d59"
    }
    else if (value > 135) {
        return "#d7301f"
    }
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    if (document.getElementById(id)){
        return document.getElementById(id).style.fill = color;
    }
}
