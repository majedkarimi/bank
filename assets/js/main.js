'use strict';
/*---------------------------------------------- 
  # 1. Data
-----------------------------------------------*/

const account1 = {
  owner: 'Fazel Ghaed',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Leili Ebadi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Salman Sepehri',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Somayeh Mousavi',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const account5 = {
  owner: 'Majed Karimi',
  movements: [120, 344, 678, 43000, -300, -400, 5000, -2000],
  interestRate: 2,
  pin: 1234,
};
const account6 = {
  owner: 'Arezu Maghsoudi',
  movements: [120, 344, 678, 43000, -300, -400, 5000, -2000],
  interestRate: 2,
  pin: 2345,
};
const accounts = [account1, account2, account3, account4, account5, account6];

/*---------------------------------------------- 
  # 2. select  Elements
-----------------------------------------------*/

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

/*---------------------------------------------- 
  # 3. Movements display 
-----------------------------------------------*/

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}$</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/*---------------------------------------------- 
  # 4. Balance Display
-----------------------------------------------*/

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);
  labelBalance.textContent = `${acc.balance} $`;
};

/*---------------------------------------------- 
  # 5. Summery display 
-----------------------------------------------*/

const calcDisplaySummery = function (acc) {
  //display in
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}$`;
  //display out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  // display intrest :
  // درصدی به دارایی خود میخواهیم اصافه کنیم و مقداری باید اضافه شود ک برگتر از 1 باشد
  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${intrest}$`;
};

/*---------------------------------------------- 
  # 6. create Username
-----------------------------------------------*/

const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // ما در مپ کل ارایه را میگیریم و میتوانیم هر اقدامی ک دوست داشتیم رو روش انجام بدیم
      .join('');
  });
};
createUsername(accounts);

/*---------------------------------------------- 
  # 7. LogIn Account
-----------------------------------------------*/

// for display
const updateUI = function (acc) {
  // Displaye Movements
  displayMovements(acc.movements);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summery
  calcDisplaySummery(acc);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  // get the Data
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // make a decide :
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI app and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //  display UI
    updateUI(currentAccount);
  }
});

/*---------------------------------------------- 
  # 8. Transfer Money
-----------------------------------------------*/

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // get account for valied form
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // put condition for valied form
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  // clear inputs
  inputTransferAmount.value = inputTransferTo.value = '';
});

/*---------------------------------------------- 
  # 9. Delete Account
-----------------------------------------------*/

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // valid form
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // calac index account
    const index = accounts.findIndex(
      acc => acc.username === inputCloseUsername.value
    );
    // delete account
    accounts.splice(index, 1);

    // hide UI
    containerApp.style.opacity = 0;
  }
  // clear inputs
  inputClosePin.value = inputCloseUsername.value = '';
});

/*---------------------------------------------- 
  # 10. Request loan
-----------------------------------------------*/

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // get the inout value and store thim :
  const amount = Number(inputLoanAmount.value);
  // make a condition valied form
  if (amount > 0 && currentAccount.movements) {
    // Add movements
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

/*---------------------------------------------- 
  # 11. Overal Balance
-----------------------------------------------*/
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((cur, mov) => cur + mov);
console.log(overalBalance);

/*---------------------------------------------- 
  # 12. Sort Section
-----------------------------------------------*/

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// fill array

/*---------------------------------------------- 
  # 13. More Ways of Creating and Filling Arrays 
-----------------------------------------------*/
// میخواهیم  لاگ تراکشن  را به به یک ارایه تبدیک کنیم
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);

  // anothe way

  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});

// more and more

const majed = accounts.find(mov => mov.owner === 'Majed Karimi');
console.log(majed);
