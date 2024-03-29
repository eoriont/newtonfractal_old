var polynom;
var zeros;

var go = false;

var resolution = 1;
var tolerance = .05;
var iterations = 500;
var zoom = 1;
var darkTolerance = 1;

var xPos = 0;
var yPos = 0;
var startPos = {x: -250/zoom, y: -250/zoom}
var screensize = {x: 500, y: 500}

function setup() {
  createCanvas(screensize.x, screensize.y);
  noStroke();
  colorMode(HSB, 100);

  // zeros = [c(1, 0), c(-.5, sqrt(3)/2), c(-.5, -sqrt(3)/2)]

  zeros = [c(1, 0), c(-1, 0), c(0, 1), c(0, -1)];

  // zeros = [c(1, 0), c((-1/4)+(sqrt(5)/4), sqrt(10+(2*sqrt(5)))/4), c((-1/4)+(sqrt(5)/4), -sqrt(10+(2*sqrt(5)))/4), c((-1/4)-(sqrt(5)/4), sqrt(10-(2*sqrt(5)))/4), c((-1/4)-(sqrt(5)/4), -sqrt(10-(2*sqrt(5)))/4)];

  // zeros = [c(-.5, .86602), c(-.5, -.86602), c(1, 0), c(-1, 0), c(.5, .86602), c(.5, -.86602)]

  zeros = [c(.88464, .58974), c(.88464, .58974), c(1.76929, 0)];
  polynom = new Polynomial([1, 0, -2, 2]);
  darkTolerance = 4;

  // polynom = Polynomial.fromZeros(zeros)
  var polynomText = createP(`\\(${polynom}\\)`)
  // var button = createButton("Start!", ["class='button'"]);
  // button.mousePressed(() => {go=!go;button.html(go ? "Pause" : "Unpause")})
  MathJax.typeset("p")
}

function draw() {
  drawFractal();
}

function newtonsMethod(xn, p) {
  let result = xn.subtract(p.evaluate(xn).divide(p.derivative().evaluate(xn)));
  return result;
}

function drawFractal() {
  if (!go) return;
  if (!(yPos < resolution * screensize.y)) {
    go = false;
    console.log("Finished");
    return;
  }

  doRow();
  yPos++;
}

function findNearestZero(val, arr) {
  let distance = arr[0].dist(val);
  let z = arr[0];

  for (let i of arr) {
    if (i.dist(val) < distance) {
      distance = i.dist(val);
      z = i;
    }
  }
  return {zero: z, dist: distance};
}

function doRow() {
  for (let i = 0; i < resolution * screensize.x; i++) {
    xPos = i;
    doPixel(i, yPos);
  }
}

function getColor(z, zs, dist) {
  let colorNum = zs.indexOf(z);
  let colorh = (100 * colorNum) / (zs.length);
  let col = color(colorh, 100, (100/darkTolerance) * (darkTolerance-dist));

  return col;
}

function doPixel(x, y) {
  let val = new ComplexNumber((x/zoom) + startPos.x, (y/zoom) + startPos.y);
  let finalNumber;
  let keepGoing
  let isnan = false;
  let i = 0;
  let nearestZero;
  do {
    val = newtonsMethod(val, polynom);
    nearestZero = findNearestZero(val, zeros);
    keepGoing = nearestZero.dist > tolerance;
    isnan = (isNaN(val.a) || isNaN(val.b))
    i++;
  } while (keepGoing && i <= iterations && !isnan);
  finalNumber = nearestZero.zero;
  fill(isnan ? 'black' : getColor(finalNumber, zeros, nearestZero.dist));
  rect(x /resolution, y / resolution, 1 / resolution, 1 / resolution);
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("toggleState").addEventListener("click", () => {
    go = !go;
    document.getElementById("toggleState").innerHTML = go ? 'Pause' : 'Unpause'
  })
})
