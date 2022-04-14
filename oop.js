// oop : prototypal inheritance

// js primitives: number, string, boolean, undefined, null
// everything else is object

// functions are function object combos

function User() {
  console.log('user created');
}

User.stored = 'fred';
console.log(User.stored);
User();
console.log(User.name);

console.log(User.hasOwnProperty('stored')); // eslint-ignore no-prototype-builtins

function Dog(nickName) {
  const dogObj = {};
  dogObj.nickName = nickName;
  dogObj.bark = function () {
    console.log('wuf!');
  };
  return dogObj;
}

const myDog = Dog('Rex');
myDog.bark();
console.log(myDog.__proto__);

const CatMethods = {
  purr: function () {
    console.log('brrr');
  }
};

function Cat(nickname) {
  const catObj = Object.create(CatMethods);
  catObj.nickName = nickname;
  return catObj;
}

const myCat = Cat('cirmi');

console.log(myCat.__proto__);
console.log(Object.getPrototypeOf(myCat));

function Car(plate, brand) {
  // 1.new keyword: csinál egy üres object-et és a this hez assignolja
  this.plate = plate;
  this.brand = brand;
  this.miles = 0;
  Object.defineProperty(this, 'legscount', {
    value: 4,
    writable: false,
    enumerable: true,
    configurable: true
  });
  // 2. automatikusan returnöli a this-t
}

// 3. a prototype object-en lévő metódusokat hozzá rendeli a __proto__-hoz
Car.prototype.incrementMiles = function () {
  this.miles++;
};

const car1 = new Car('asd', 'bmw');
car1.incrementMiles();
console.log(car1.__proto__);

function test() {
  console.log(this);
}

Car.prototype.decrementMiles = function () {
  function remove1() {
    this.miles--; // this = global;
  }
  remove1();
};

car1.decrementMiles();
console.log(car1.miles);
console.log(global.miles);

// class keyword: a classon belül definiált megódusokat, azonnal __proto__-hoz köti
// class-on belul mindig sctrict mode-ba fut a JS
class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
  }
  increment() {
    this.score++;
  }
  decrement() {
    function dec() {
      this.score++;
    }
    dec();
  }
}

const player1 = new Player('Peter', 0);
console.log(player1.__proto__);
console.log(Object.getOwnPropertyNames(player1.__proto__));
// player1.decrement(); // ERROR
