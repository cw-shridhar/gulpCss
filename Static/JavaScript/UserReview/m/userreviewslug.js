var canvases = document.getElementsByClassName("rating-arc");

for(var i = 0 ; i < canvases.length ; i++) {
    var canvasId = "rating-arc-" + i;
    var spanId = "rating-arc-text-" + i;
    var rating = parseFloat(document.getElementById(spanId).textContent);
    rating = Math.round(rating * 100) / 100;
    var ratingColor = rating >= 4 ? "#00afa0" : "#56586a";
    document.getElementById(spanId).textContent = rating;
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");
    var correction = (Math.PI/2);
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.strokeStyle = "#d2d2d5";
    ctx.arc(canvas.width/2, canvas.height/2, canvas.height/2, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = ratingColor;
    ctx.arc(canvas.width/2, canvas.height/2, canvas.height/2, - correction, (2 * Math.PI / 5.0 * rating) - correction);
    ctx.stroke();
}