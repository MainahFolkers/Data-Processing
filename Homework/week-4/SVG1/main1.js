// Name: Mainah
// Student number: 10535845

/* use this to test out your function */
window.onload = function() {
 	changeColor("fra", "#FFA500");
    changeColor("rsa", "#FFFF00");
    changeColor("port", "#00FFFF");
    changeColor("dui", "#FF00FF");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
    return document.getElementById(id).style.fill = color;
}
