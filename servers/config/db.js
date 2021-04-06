const mysql = require('mysql');

//https://fe-flower.tistory.com/27?category=859209

const db = mysql.createConnection({
    host : 'haf-db.cy3fqhdtxrse.us-east-2.rds.amazonaws.com',
    port : '3306',
    user : 'haf',
    password : 'medicine',
    database : 'haf_db'
});

module.exports = db;