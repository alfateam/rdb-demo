const rdb = require('rdb');
const resetDemo = require('./db/resetDemo');

const Customer = rdb.table('_customer');
const Order = rdb.table('_order');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

Order.primaryColumn('oId').guid().as('id');
Order.column('oOrderNo').string().as('orderNo');
Order.column('oCustomerId').guid().as('customerId');
Order.join(Customer).by('oCustomerId').as('customer');

const db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let order = await Order.getById('a0000000-a000-0000-0000-000000000000');
            console.log(await order.toJSON({customer: null}));
        });
    } catch (e) {
        console.log(e.stack);
    }
}();