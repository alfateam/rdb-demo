let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');
let Order = rdb.table('_order');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');

Order.join(Customer).by('oCustomerId').as('customer');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(tryGetFirstOrderWithCustomer)
    .then(printOrder)
    .then(printCustomer)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function tryGetFirstOrderWithCustomer() {
    let filter = Order.customer.name.equal('John');
    let strategy = {customer : null};
    return Order.tryGetFirst(filter, strategy);
}

function printOrder(order) {
    if (!order) {
        console.log('order not found');
        return;
    }
    let format = 'Order Id: %s, Order No: %s, Customer Id: %s';
    let args = [format, order.id, order.orderNo, order.customerId];
    console.log.apply(null,args);
    return order.customer;
}

function printCustomer(customer) {
    if (!customer)
        return;
    console.log('Customer Id: %s, name: %s', customer.id, customer.name);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}