'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
//! all 4  acccounts are added here
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  //* we added sort later to sort the items and make the sort button working
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  //* we used slice to make a copy of the array
  //* we copied the array because we don't want to affect the original array
  //* we worked on the copied array here . and original 'movements' array was safe

  //you have to follow the sequence in foreach loop
  movs.forEach(function (mov, i) {
    //! we are checking if it's a deposit or withdrawal to apply it in css class and type
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
    </div>`;

    //! we have changed the class in css here. as you can see the  'type' has been wriiten in both css class
    //! and in normal text content
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//we will call this after login
// displayMovements(account1.movements);

// this function is also taking the value of movements displaying the incomes.
//*means total deposits
// this will also work the same for out
//* means total withdrawal
// interest
//* interest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    //if you want to see the whole array or
    //here it is used to filter 'the inteerest that is more than 1'

    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(interest)}€`;
};
//we will call this after login
// calcDisplaySummary(account1.movements);

// Now let's make a user name for the site
const createUserNames = function (accs) {
  // accs is used for accounts . this name starts here. i was searching for it.like...from where it comes
  //accs here gets the 'accounts' variable. and we are calling the function down below
  //now we will loop into the accounts
  accs.forEach(function (acc) {
    acc.username = acc.owner
      //we are getting individual user from the account. and taking the name from acc.owner
      //then manupulating it
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);
console.log(accounts);

//!this function is used to calculate the total balance available of the client
//this is using the reduce method to calculate the sum of the 'movements'. and showing it on the page
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // balance = acc.balance;
  labelBalance.textContent = `${acc.balance} EUR`;
};
//we will call this after login
// calcDisplayBalance(account1.movements);

//! this function is being used to call all the funcions at once after login
//!you will see to call the functions at once at the end of the login button function
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //!if the current account exists only then it will check for the pin

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //if logged in show the UI
    //otherwise not

    //Display UI and message
    //with the splt we are taking the first name by spliting
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //makes the pin blurry

    //*this function is calling all the functions at onnce
    //*that is needed after login
    updateUI(currentAccount);
  }
});

//this section will be used to transfer the money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  //* transfer amount
  const amount = Number(inputTransferAmount.value);
  //* transfer to
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  //this line is to reset the form
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    //currentAccount has been declared as 'let currentAccount' a little bit ago. in previous function
    //in case if you don't find currentAccount
    receiverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer. pushing the money amount to the 'movements'
    //* this will automatically calculate the main balance
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);

    //reset
    inputLoanAmount.value = '';
  }
});

// this section will be responsible to delete the user from the account
//* here we will larn findIndex
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // console.log('hello');
  // console.log(Number(inputClosePin.value));
  // console.log(inputCloseUsername.value);
  // console.log(currentAccount.username);
  // console.log(currentAccount.pin);

  if (
    //! checking if it is the current user
    //!if the current user is valid and the user knows his pin
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //* then we will use findIndex method to search for the userIndex
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // indexOf only works when the element is in the array
    //.indexOf(23)

    console.log(index);

    // Delete the account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  // reset field
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  //! we needed to pass true here. that's why we used !sorted
  //! !sorted is true. because sorted was set to false
  //! but after clicking it again it will go back to false because it was set to true
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sarted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//* for (const (movement) of movements )
//! you don't have to put '.entries' there

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1} You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}; You withdrew ${Math.abs(movement)}`);
  }
}

console.log('---FOREACH---');
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1} You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}; You withdrew ${Math.abs(mov)}`);
  }
});

/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//! foreach on a map
currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//! foreach on a set

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// this line can be written like this

const movementsUSD = movements.map(mov => mov * euroToUsd);
console.log(movements);
console.log(movementsUSD);

//texts with conditions and map
//checking withdrawal or deposit
const movementsDescriptions = movements.map(
  (mov, i, arr) =>
    `Movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);
console.log(movementsDescriptions);
//> output: method 1: you have deposited or withdrawal 300$
//this gives us a whole new array .

// movements: [200, 450, -400, 3000, -650, -130, 70, 1300]
const deposits = movements.filter(mov => mov > 0);
console.log(movements);
console.log(deposits);

//reduce method is used to make a sum or something like that of an array
//we can multiply or anything with that
//first parameter is accumulator or the first item of an array
//means that will intrigue the function
//cur on the other hand is the final element or the final ending item of the array that will close the function
// it actually can be a second value. think like this
// accumulator is working with the next value. so.cur/mov is the second value to next value like iteration too
//i is the index
//arr is the array
// 0 is where the result starts from.
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}:${acc}`);
  return acc + cur;
}, 0);
console.log(balance);

//Example : another reduce method to calculate the maximum value of the array
const max = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else {
    return mov;
  }
}, movements[0]);

//we will now use map, filter and reduce method together
//*this function will calculate the total sum of deposits and covert them into usd
//const euroToUsd = 1.1;

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);

//! Now we will work on the find method
//find method acts like the filter method
//but it gives the first value that matches the condition

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);
//filter method returns all the values in the array that matches the condition
//but the find method only returns the first value that matches the condition

//filter method gives an array as output
//find method gives an element as output

//! to get the only account that matches the conditiion

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
//> output: you will see the whole name wiht additional elemets
//>{owner: "Jessica Davis", movements: Array(8), interestRate: 1.5, pin: 2222, username: "jd"}

//* include method

console.log(movements);
console.log(movements.includes(-130));
//>output: True
// this checks if the value is in the array and returns a boolean
//is checks equality

//* some method
//* to check if it includes but with condition

const anyDeposits = movements.some(mov => mov > 0);
//it is checking if any value is in the list that is above 0
// it returns boolean
console.log(anyDeposits);

//Every
// the condition must be matched with all the elements
//it will return a boolean
console.log(movements.every(mov => mov > 0));
//>output: false
//* in account 4 all the movements are positive
console.log(account4.movements.every(mov => mov > 0));
//>output: true

//seperate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
// it works the same just called it spearately

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());
//takes all the sets and makes it one. means merges them all
//this is brand new. thats why it won't work on most of the browsers

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));
//this goes two levels deep
//if you want more increase the number like
//!flat(2),flat(3),flat(4)

// //* now we will take all the movements in different arrays in a single array
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// //! it merged all the arrays into one
// //* let's make sum of all arrays
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// we can do all these with chaining

const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);
//we merged all the previous code to merge all the elements in the arrats

//we can also do flatmap to flat and map at the same time

const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

//normally numbers are sorted like strings in javascript

console.log(movements);
console.log(movements.sort());

//To solve the problem

//if return < 0  ,A,B(keep order)
//return > 0  ,B,A (switch order)
movements.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1;
});
//this equation will sort the array as we want
console.log(movements);
//! we can do the same thing shorter
movements.sort((a, b) => a - b);
console.log(movements);

// for descending order
movements.sort((a, b) => {
  if (a > b) return -1;
  if (b > a) return 1;
});
console.log(movements);
movements.sort((a, b) => b - a);
// this is the short form

console.log([1, 2, 3, 4, 5, 6, 7]);
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
//this doesn't work. it will return 7 empty array
console.log(x);

//fill method
// fill is used to ful fill the empty array

x.fill(1);
//! this will fill the empty arrays with 1

x.fill(1, 3);
//! this will fill the empty arrays with 1  but starts at 3 position

x.fill(1, 3, 5);
//! this will fill the empty arrays with 1  but starts at 3 to 5 position

// Array.form
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
//this also fills the array with 1 . (7 empty arrays)

const z = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(z);
//* this works just like the map function
//* this will make an array of [1 to 7]

//* we can use from method wiht the array like object
//* like with querySelectorAll

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
  el => Number(el.textContent.replace('€', ''));
  console.log(movementsUI);
  //! this will convert an array like content to an array
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});
