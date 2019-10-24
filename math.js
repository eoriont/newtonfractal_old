class ComplexNumber {
  constructor(a = 0, b = 0) {
    this.a = a;
    this.b = b;
  }

  add(num) {
    let newA = this.a + num.a;
    let newB = this.b + num.b;
    return c(newA, newB);
  }

  subtract(num) {
    let newA = this.a - num.a;
    let newB = this.b - num.b;

    return c(newA, newB);
  }

  multiply(num) {
    let newA = (this.a * num.a) - (this.b * num.b);
    let newB = (this.a * num.b) + (this.b * num.a);

    return c(newA, newB);
  }

  divide(num) {
    let newA = ((this.a * num.a) + (this.b * num.b))/(num.a**2 + num.b**2);
    let newB = ((this.b * num.a) - (this.a * num.b))/(num.a**2 + num.b**2);

    return c(newA, newB);
  }

  pow(num) {
    let newNum = c(1, 0);
    for (let i = 0; i < num; i++) {
      newNum = newNum.multiply(this);
    }
    return newNum;
  }

  toString() {
    return `${this.a.toFixed(2)} + ${this.b.toFixed(2)}i`;
  }

  dist(num) {
    return Math.sqrt((num.a-this.a)**2 + (num.b-this.b)**2);
  }
}

function c(a = 0, b = 0) {
  return new ComplexNumber(a, b);
}
/*
 *  The Polynomial Constructor is backwards, so new Polynomial([1, 2, 3]) = 3x^2 + 2x + 1
 */
class Polynomial {
  constructor(terms = []) {
    this.terms = terms.map(t => {
      return typeof t != "object" ? c(t) : t
    })
  }

  evaluate(x) {
    let result = c();
    for (let i = 0; i < this.length(); i++) {
      let evalTerm = this.getTerm(i).multiply(x.pow(i))
      result = result.add(evalTerm);
    }
    return result;
  }

  derivative() {
    let d = new Polynomial();

    for (let i = 0; i < this.length()-1; i++) {
      let newTerm = this.getTerm(i+1).multiply(c(i+1, 0));
      d.setTerm(i, newTerm);
    }
    return d;
  }

  setTerm(i, term) {
    this.terms[i] = term;
  }

  add(polynomial) {
    let longestLength = polynomial.length() > this.length() ? polynomial.length() : this.length();
    let poly = p();
    for (let i = 0; i < longestLength; i++) {
      let a = this.getTerm(i)
      let b = polynomial.getTerm(i)
      poly.setTerm(i, a.add(b));
    }
    return poly;
  }

  subtract(polynomial) {
    return polynomial.multiply(p([c(-1, 0)])).add(this);
  }

  multiply(polynomial) {
    let poly = p();
    let longestLength = polynomial.length() > this.length() ? polynomial.length() : this.length();

    for(let i = 0; i < this.length(); i++) {
      let tP = p();
      let thisTerm = this.getTerm(i);
      for (let j = 0; j < polynomial.length(); j++) {
        let pTerm = polynomial.getTerm(j);

        let newTerm = thisTerm.multiply(pTerm);
        let newIndex = i + j;

        tP.setTerm(newIndex, newTerm);
      }
      poly = poly.add(tP);
    }
    return poly;
  }

  length() {
    return this.terms.length;
  }

  getTerm(index) {
    return this.terms[index] == undefined ? c() : this.terms[index];
  }

  getTerms() {
    return this.terms;
  }

  static fromZeros(arr) {
    let pArr = [];
    for (let i of arr) {
      pArr.push(p([i.multiply(c(-1, 0)), c(1, 0)]));
    }
    let poly = p([c(1, 0)])
    for (let i of pArr) {
      poly = poly.multiply(i);
    }
    return poly;
  }

  toString() {
    let string = "";
    for (let i = 0; i < this.length(); i++) {
      let t = this.getTerm(this.length()-i-1);
      let str = `(${t})x^${this.length()-i-1}`
      string += `${str} +`
    }
    string = string.slice(0, -1)
    return string;
  }
}

function p(arr = []) {
  return new Polynomial(arr)
}
