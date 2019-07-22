const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Order = rdb.table('_order');
const Customer = rdb.table('_customer');
const OrderLine = rdb.table('_orderLine');
const DeliveryAddress = rdb.table('_deliveryAddress');

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

const order_customer_relation = Order.join(Customer).by('oCustomerId').as('customer');

const line_order_relation = OrderLine.join(Order).by('lOrderId').as('order');
Order.hasMany(line_order_relation).as('lines');

const deliveryAddress_order_relation = DeliveryAddress.join(Order).by('dOrderId').as('order');
Order.hasOne(deliveryAddress_order_relation).as('deliveryAddress');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let orders = await Order.getMany();
            let strategy = {customer : null, lines : null, deliveryAddress : null};
            console.log(await orders.toJSON(strategy));
        });
    } catch (e) {
        console.log(e.stack);
    }
}();