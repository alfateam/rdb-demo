var rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

var Order = rdb.table('_order');
var Customer = rdb.table('_customer');
var OrderLine = rdb.table('_orderLine');
var DeliveryAddress = rdb.table('_deliveryAddress');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').string().as('customerId');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

DeliveryAddress.primaryColumn('dId').guid().as('id');
DeliveryAddress.column('dOrderId').string().as('orderId');
DeliveryAddress.column('dName').string().as('name');
DeliveryAddress.column('dStreet').string().as('street');

var order_customer_relation = Order.join(Customer).by('oCustomerId').as('customer');

var line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

var deliveryAddress_order_relation = DeliveryAddress.join(Order).by('dOrderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

var db = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = resetDemo()
    .then(db.transaction)
    .then(getOrders)
    .then(toJSON)
    .then(print)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function getOrders() {
    return Order.getMany();
}

function toJSON(orders) {
    var strategy = {customer : null, lines : null, deliveryAddress : null};
    return orders.toJSON(strategy);
}

function print(json) {
    console.log(json);
}

function onOk() {
    console.log('Success');
    console.log('Waiting for connection pool to teardown....');
}

function onFailed(err) {
    console.log('Rollback');
    console.log(err);
}