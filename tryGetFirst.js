var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cBalance').numeric().as('balance');
Customer.column('cRegdate').date().as('registeredDate');
Customer.column('cIsActive').boolean().as('isActive');
Customer.column('cPicture').binary().as('picture');

var db = rdb('postgres://postgres:postgres@localhost/test');

resetDemo() 
    .then(db.transaction)
    .then(tryGetFirst)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .done(onOk, onFailed);

function tryGetFirst() {
    var filter = Customer.name.equal('Bill');
    return Customer.tryGetFirst(filter);
}

function printCustomer(customer) {
    if (customer) {
        var format = 'Customer Id: %s, name: %s, Balance: %s, Registered Date: %s, Is Active: %s, Picture: %s'; 
        var args = [format, customer.id, customer.name, customer.balance, customer.registeredDate, customer.isActive, customer.picture];
        console.log.apply(null,args);
    }
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    throw(err);
}