let rdb = require('rdb');
let resetDemo = require('../db/resetDemo');

let Customer = rdb.table('_customer');

Customer.primaryColumn('cId').guid().as('id');
Customer.column('cName').string().as('name');

let db = rdb('mysql://root@localhost/rdbDemo?multipleStatements=true');

module.exports = async function() {
    try {
        await resetDemo();
        await db.transaction(async () => {
            let john = Customer.name.equal('John');
            let yoko = Customer.name.equal('Yoko');
            let filter = rdb.filter.or(john).or(yoko);
            //alternatively rdb.filter.and(john).or(yoko);
            let customers = await Customer.getMany(filter);
            console.log(await customers.toDto());
        });
    } catch (e) {
        console.log(e.stack);
    }
}();