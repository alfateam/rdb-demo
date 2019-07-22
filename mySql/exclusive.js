let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');
let promise = require('promise/domains');

let Customer = rdb.table('_customer');
Customer.primaryColumn('cId').guid().as('id');
Customer.column('cBalance').numeric().as('balance');
Customer.exclusive();

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await showBalance();
        await updateConcurrently();
        await showBalance();
        console.log('Waiting for connection pool to teardown....');
    } catch (e) {
        console.log(e.stack);
        rdb.rollback();
    }
}();

async function showBalance() {
    try {
        await db.transaction();
        let customer = await getById();
        console.log('Balance: ' + customer.balance);
        await rdb.commit();
    } catch (e) {
        rdb.rollback();
    }
}

function updateConcurrently() {
    let concurrent1 = db.transaction()
        .then(getById)
        .then(increaseBalanceBy100)
        .then(rdb.commit)
        .then(null, rdb.rollback);

    let concurrent2 = db.transaction()
        .then(getById)
        .then(increaseBalanceBy100)
        .then(rdb.commit)
        .then(null, rdb.rollback);
    return promise.all([concurrent1, concurrent2]);
}

function getById() {
    return Customer.getById('a0000000-0000-0000-0000-000000000000');
}

function increaseBalanceBy100(customer) {
    customer.balance += 100;
}