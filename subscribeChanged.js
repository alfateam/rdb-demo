let rdb = require('rdb');
let resetDemo = require('./db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');
Customer.column('cDocument').json().as('document');

Customer.subscribeChanged(({row, patch}) => {
    console.log(patch);
    console.log(row.document)
});


let db = rdb('postgres://rdb:rdb@localhost/rdbdemo');

module.exports = async function() {
    await resetDemo();
    await db.transaction(async () => {
        let customer = await Customer.getById('a0000000-0000-0000-0000-000000000000');
        customer.document[0] = 'baz';
    });
}();