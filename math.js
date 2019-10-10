class ComplexNumber {
  constructor(a = 0, b = 0) {
    this.a = a;
    this.b = b;
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


/*
 *  The Polynomial Constructor is backwards, so new Polynomial([1, 2, 3]) = 3x^2 + 2x + 1
 *  TODO: Make Complex Polynomials
 */
class Polynomial {
  constructor(terms = []) {
    this.terms = terms;
  }

  evaluate(x) {
    let degree = this.length();
    let result = new ComplexNumber();

    for (let i = 0; i < degree; i++) {
      let evalTerm = new ComplexNumber(this.getTerm(i), 0).multiply(x.pow(i))
      result.add(evalTerm);
    }

    return result;
  }

  derivative() {
    let d = new Polynomial();

    for (let i = 0; i < this.length()-1; i++) {
      let newTerm = this.getTerm(i+1) * (i+1);
      d.setTerm(i, newTerm);
    }
    return d;
  }

  setTerm(i, term) {
    this.terms[i] = term;
  }

  add(polynomial) {
    let longestLength = polynomial.length() > this.length() ? polynomial.length() : this.length();
    let p = new Polynomial();
    for (let i = 0; i < longestLength; i++) {
      let a = this.getTerm(i)
      let b = polynomial.getTerm(i)
      p.setTerm(i, a + b);
    }
    return p;
  }

  subtract(polynomial) {
    return polynomial.multiply(new Polynomial([-1])).add(this);
  }

  multiply(polynomial) {
    let p = new Polynomial();
    let longestLength = polynomial.length() > this.length() ? polynomial.length() : this.length();

    for(let i = 0; i < this.length(); i++) {
      let tP = new Polynomial();
      let thisTerm = this.getTerm(i);
      for (let j = 0; j < polynomial.length(); j++) {
        let pTerm = polynomial.getTerm(j);

        let newTerm = thisTerm * pTerm;
        let newIndex = i + j;

        tP.setTerm(newIndex, newTerm);
      }
      p = p.add(tP);
    }
    return p;
  }

  length() {
    return this.terms.length;
  }

  getTerm(index) {
    return this.terms[index] == undefined ? 0 : this.terms[index];
  }

  getTerms() {
    return this.terms;
  }

  static fromZeros(arr) {
    debugger;
    let pArr = [];
    for (let i of arr) {
      pArr.push(new Polynomial([-i, 1]));
    }
    let p = new Polynomial([1])
    for (let i of pArr) {
      p = p.multiply(i);
    }
    return p;
  }
}
