var init = require('./db/init');
var db = require('./db/myDb');
var Order = require('./db/order');
var Customer = require('./db/customer');

var commit, rollback;

insertDemoThenGet();

function insertDemoThenGet() {
    init(runDbTest, onFailed);
}

function runDbTest() {
    var transaction = db.transaction();
    commit = transaction.commit;
    rollback = transaction.rollback;

    transaction.then(getById).then(printOrder).then(commit).then(null, rollback).then(onOk, onFailed).then(final);
}

function getById() {
    return Order.getById('58d52776-2866-4fbe-8072-cdf13370959b');
}

function printOrder(order) {
    var image = order.image;
    console.log('id: %s, customerId: %s, status: %s, tax: %s, units: %s, regDate: %s, sum: %s, image: %s', order.id, order.customerId, order.status, order.tax, order.units, order.regDate, order.sum, order.image.toJSON());
}

function printJSON(json) {    
    console.log(json);
}

function onOk() {
    console.log('Success.');
}

function final() {
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('failed: ' + err);
    if (err.stack)
        console.log('stack: ' + err.stack);
}