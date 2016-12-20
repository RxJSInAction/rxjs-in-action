/**
 *  RxJS in action
 *  Chapter # 10
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';


const {createStore} = Redux;
// Create a DB
const db = new PouchDB('kittens');

// Initialize the values
db.get('accounts')
  .catch(err => {
    return db.put({_id: 'accounts', checking: 100, savings: 100});
  });

/**
 * Actions
 */
const setField = (field, value) => ({type: 'SET_TRANSACTION_FIELD', field, value});
const setProcessing = (isProcessing) => ({type: 'SET_PROCESSING', isProcessing});
const queueTransaction = (transaction) => ({type: 'QUEUE_TRANSACTION', transaction});
const setBalances = (balances) => ({type: 'SET_BALANCES', balances});

function computeTransaction(tx, doc) {
  const {amount, account, factor} = tx;
  const {_rev} = doc;

  //Get account we are interested in updating
  const target = doc[account];

  //Compute a new balance for the account
  const newBalance = target + amount * factor;

  // Create a new balances object
  const newAccounts = Object.assign({}, doc, {[account]: newBalance});
  // const newAccounts = {...doc, [account]: newBalance};
}

// Create the store
const app = createStore(reducer, {
  fields: {account: 'checking', amount: 10},
  queue: [],
  isProcessing: false,
  checking: 0,
  savings: 0
});

function reducer(state = {fields: {}}, action) {
  switch (action.type) {
    case 'SET_TRANSACTION_FIELD':
      const {fields} = state;
      console.log("Setting field", JSON.stringify(action));

      const newFields = Object.assign({}, fields, {[action.field]: action.value});
      // const newFields = {...fields, [action.field]: action.value};
      console.log("Updating fields", JSON.stringify(newFields));
      return Object.assign({}, state, {fields: newFields});
      // return {...state, fields: newFields};
    case 'QUEUE_TRANSACTION':
      // Take a snapshot of the current UI
      const transaction = Object.assign({}, action.transaction);
      // const transaction = {...action.transaction};

      // Add the transaction to the queue
      return Object.assign({}, state, {queue: [transaction, ...state.queue]});
      // return {...state, queue: [transaction, ...state.queue]};
    case 'SET_PROCESSING':
      // Update if the system is currently processing an item
      return Object.assign({}, state, {isProcessing: action.isProcessing});
      // return {...state, isProcessing: action.isProcessing};
    case 'SET_BALANCES':
      return Object.assign({}, state, action.balances);
      // return {...state, ...action.balances};
    default:
      return state;
  }
}

// Subscribe to changes
app.subscribe(() => {
  const {queue, isProcessing} = app.getState();

  // Nothing to process
  if (queue.length === 0 || isProcessing) {
    return;
  }

  // Extract the next transaction
  const {amount, account, factor} = queue.pop();

  if (!account || !amount) {
    console.error('Must define all fields!');
    return;
  }

  // Block other transactions from occurring at the same time
  app.dispatch(setProcessing(true));

  // First we need to get the latest from the accounts object
  db.get('accounts').then(doc => {
    // Create a new balances object
    const newAccounts = computeTransaction({amount, account, factor}, doc);

    const {checking, savings} = newAccounts;

    // Update the database
    return db.put(newAccounts)
      .then(() => ({checking, savings}));
  }).then(newAccounts => {
    // Update balances
    app.dispatch(setBalances(newAccounts));

    // Tell the system that we are done processing
    app.dispatch(setProcessing(false));
  }).catch(err => {
    console.error("There was a problem updating the balances", err);
    // If there was an error then tell the system that we are done processing as well
    app.dispatch(setProcessing(false));
  })
});

/**
 *
 *  End interesting bit
 *
 */

const withdraw = document.getElementById('withdraw');
const deposit = document.getElementById('deposit');
const accountInput = document.getElementById('account');
const amountInput = document.getElementById('amount');

app.dispatch(setField('account', 'checking'));
app.dispatch(setField('amount', 10));

accountInput.addEventListener('change', function(e) {
  app.dispatch(setField('account', e.target.value));
});

amountInput.addEventListener('change', function(e) {
  app.dispatch(setField('amount', +(e.target.value)));
});

withdraw.addEventListener('click', function(e) {
  // Snapshots the current fields and queues a transaction
  const {amount, account} = app.getState().fields;
  app.dispatch(queueTransaction({amount, account, factor: -1}));
});

deposit.addEventListener('click', function(e) {
  // Snapshots the current fields and queues a transaction
  const {amount, account} = app.getState().fields;
  app.dispatch(queueTransaction({amount, account, factor: +1}));
});

/* DOM manipulation */
app.subscribe(() => {
  const {checking, savings} = app.getState();

  document.getElementById('test').innerHTML = `Checking: ${checking}, Savings: ${savings}`;
});