let rdb = require('rdb'),
    resetDemo = require('./db/resetDemo');

let Order = rdb.table('_order');
let OrderLine = rdb.table('_orderLine');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');

OrderLine.primaryColumn('lId').guid().as('id');
OrderLine.column('lOrderId').guid().as('orderId');
OrderLine.column('lProduct').string().as('product');

let line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

let db = rdb.sqlite(__dirname + '/db/rdbDemo');
let orderIdWithNoLines = 'c0000000-c000-0000-0000-000000000000';

module.exports = resetDemo()
    .then(db.transaction)
    .then(insertOrderLine1)
    .then(insertOrderLine2)
    .then(verifyUpdated)
    .then(rdb.commit)
    .then(null, rdb.rollback)
    .then(onOk, onFailed);

function insertOrderLine1() {
    let line = OrderLine.insert('eeeeeeee-0001-0000-0000-000000000000');
    line.orderId = orderIdWithNoLines;
    line.product = 'Roller blades';
    return line.order;
}

function insertOrderLine2() {
    let line = OrderLine.insert('eeeeeeee-0002-0000-0000-000000000000');
    line.orderId = orderIdWithNoLines;
    line.product = 'Helmet';
    return line.order;
}

function verifyUpdated(order) {
    console.log(order.id);
    return order.lines.then(verifyUpdatedLines);
}

function verifyUpdatedLines(lines) {
    console.log(lines.length);
    if (lines.length !== 2)
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