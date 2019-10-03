class ComplexNumber {
  constructor(a, b) {
    this.a = a;
    this.b = b;
    this.divide_by_zero = false;
  }

  add(num) {
    this.a += num.a;
    this.b += num.b;

    return this;
  }

  subtract(num) {
    this.a -= num.a;
    this.b -= num.b;

    return this;
  }

  multiply(num) {
    let newA = (this.a * num.a) - (this.b * num.b);
    let newB = (this.a * num.b) + (this.b * num.a);

    this.a = newA;
    this.b = newB;

    return this;
  }

  divide(num) {
    let newA = ((this.a * num.a) + (this.b * num.b))/(num.a**2 + num.b**2);
    let newB = ((this.b * num.a) - (this.a * num.b))/(num.a**2 + num.b**2);
    this.a = newA;
    this.b = newB;
    return this;
  }

  pow(num) {
    let newNum = new ComplexNumber(1, 0);
    for (let i = 0; i < num; i++) {
      newNum.multiply(this);
    }

    return newNum;
  }

  toString() {
    return `${this.a} + ${this.b}i`;
  }

  dist(num) {
    return Math.sqrt((num.a-this.a)**2 + (num.b-this.b)**2);
  }
}

class Polynomial {
  constructor(terms) {
    this.terms = terms;
  }

  evaluate(x) {
    let degree = this.terms.length-1;
    let result = new ComplexNumber(0, 0);

    for (let i = 0; i < degree+1; i++) {
      let evalTerm = new ComplexNumber(this.terms[i], 0).multiply(x.pow(degree-i))
      result.add(evalTerm);
    }

    return result;
  }

  derivative() {
    let d = new Polynomial([]);

    for (let i = 0; i < this.terms.length; i++) {
      if (i == this.terms.length-1) {
        break;
      }

      let newTerm = this.terms[i] * (this.terms.length-i-1);
      d.addTerm(newTerm, i);
    }
    return d;
  }

  addTerm(term, i) {
    this.terms[i] = term;
  }
}

function newtonsMethod(xn, p) {
  let result = xn.subtract(p.evaluate(xn).divide(p.derivative().evaluate(xn)));
  return result;
}

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

  zeros = [new ComplexNumber(1, 0), new ComplexNumber(-.5, sqrt(3)/2), new ComplexNumber(-.5, -sqrt(3)/2)]
  polynom = new Polynomial([1, 0, 0, -1]);

  // zeros = [new ComplexNumber(1, 0), new ComplexNumber(-1, 0), new ComplexNumber(0, 1), new ComplexNumber(0, -1)];
  // polynom = new Polynomial([1, 0, 0, 0, -1]);

  // zeros = [new ComplexNumber(1, 0), new ComplexNumber((-1/4)+(sqrt(5)/4), sqrt(10+(2*sqrt(5)))/4), new ComplexNumber((-1/4)+(sqrt(5)/4), -sqrt(10+(2*sqrt(5)))/4), new ComplexNumber((-1/4)-(sqrt(5)/4), sqrt(10-(2*sqrt(5)))/4), new ComplexNumber((-1/4)-(sqrt(5)/4), -sqrt(10-(2*sqrt(5)))/4)];
  // polynom = new Polynomial([1, 0, 0, 0, 0, -1]);

  zeros = [new ComplexNumber(-.5, .86602), new ComplexNumber(-.5, -.86602), new ComplexNumber(1, 0), new ComplexNumber(-1, 0), new ComplexNumber(.5, .86602), new ComplexNumber(.5, -.86602)]
  polynom = new Polynomial([1, 0, 0, 0, 0, 0, -1]);

  // zeros = [new ComplexNumber(.88464, .58974), new ComplexNumber(.88464, .58974), new ComplexNumber(1.76929, 0)];
  // polynom = new Polynomial([1, 0, -2, 2]);
  // darkTolerance = 4;

  var button = createButton("Start!");
  button.mousePressed(() => {go=!go;button.html(go ? "Pause" : "Unpause")})
}

function draw() {
  drawFractal();
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
