let rdb = require('rdb');

let dbPg = rdb('postgres://postgres:postgres@localhost/test');
let dbMySql = rdb.mySql('mysql://root@localhost/rdbDemo?multipleStatements=true');
let dbSqlite = rdb.sqlite(__dirname + '/db/rdbDemo');

module.exports = connectPg()
    .then(connectMySql)
    .then(connectSqlite)
    .then(rdb.end)
    .then(onOk, onFailed);


function connectPg() {
    return dbPg.transaction()
        .then(rdb.commit)
        .then(null, rdb.rollback);
}

function connectMySql() {
    return dbMySql.transaction()
        .then(rdb.commit)
        .then(null, rdb.rollback);
}

function connectSqlite() {
    return dbSqlite.transaction()
        .then(rdb.commit)
        .then(null, rdb.rollback);
}

function onOk() {
    console.log('Pools ended.');
}

function onFailed(err) {
    console.log(err.stack);
}
