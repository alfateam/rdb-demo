let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(insert)
    .then(getById) //will use cache
    .then(verifyInserted)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function insert() {
    let customer = Customer.insert('abcdef00-0000-0000-0000-000000000000')
    customer.name = 'Paul';
}

function getById() {
    return Customer.getById('abcdef00-0000-0000-0000-000000000000');
}

function verifyInserted(customer) {
    if (customer.name !== 'Paul')
        throw new Error('this will not happen');
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}