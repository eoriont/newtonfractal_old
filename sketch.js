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
    if ((num.a**2 + num.b**2) == 0) this.divide_by_zero = true
    return this;
  }

  pow(num) {
    let newNum = new ComplexNumber(this.a, this.b);
    if (num == 0) {
      newNum.a = 1;
      newNum.b = 0;
      return newNum;
    }
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

var polynom = new Polynomial([1, 0, 0, -1]);
var zeros = [1, 0, 7];
var colors = ['red', 'green', 'blue'];

function setup() {
  s1etup();
}

function s1etup() {
  let resolution = 1;
  let startPos = {x: -250, y: -250}
  let zoom = .0001;
  createCanvas(500, 500);
  noStroke();
  console.log("Starting");
  for (let x = 0; x < resolution*500; x++) {
    for (let y = 0; y < resolution*500; y++) {
      let zero;
      let val = new ComplexNumber((x/zoom) + startPos.x, (y/zoom) + startPos.y);
      let finalNumber;
      let keepGoing
      do {
        val = newtonsMethod(val, polynom);
        finalNumber = isWithinRangeOf(zeros, 1, val)
        keepGoing = typeof(finalNumber) != "number";
      } while (keepGoing);
      let col = colors[zeros.indexOf(finalNumber)];
      fill(col);
      rect(x /resolution, y / resolution, 1/resolution, 1/resolution);
    }
  }
  console.log("Finished");
}

function isWithinRangeOf(arr, range, val) {

  for (let i of arr) {
    if (val.dist(new ComplexNumber(i, 0)) < range) {
      return i;
    }
  }

  return false;
}
