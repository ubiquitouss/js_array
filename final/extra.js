// balances = [1252, 2362, 123, 564, 856, 423, 145, 236];

// const balance = balances.reduce(function (acc, cur, i, arr) {
//   return arr;
// });
// console.log(balance);
const euroToUsd = 1.1;
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const totalDepositsUsD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * euroToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUsD);
