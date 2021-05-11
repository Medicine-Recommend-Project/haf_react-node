const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin, isNotLogin } = require('./passportMw');

let data, sqlQuery, sql;

// 게시판작성 시 상품 고를 수 있게 해주는거 + 로딩되는 김에 로그인 유저 아이디랑 이름 가져가기
router.get("/getPcode", isLogin, (req,res)=>{
    sqlQuery = " SELECT pcode, pname FROM product  ";
    sql = db.query(sqlQuery, (err, row) => {
            if(!err) {
                result(row.length);
                let data = {row: row, cid: req.user.cid, cname: req.user.cname}
                res.json(data);
                // res.json(row);
            } else {
                logger.error(err);
            }
        });
});

router.get('/products', (req, res)=> {
    sqlQuery = "SELECT * FROM product ";
    sql = db.query (sqlQuery, (err, row) => {
            result(row.length);
        if(err) { logger.error(err); }
        else { res.json(row); }
    });
});

router.post('/detail', (req, res)=> {
    sqlQuery = "SELECT * FROM product WHERE pcode = ?";
    data = [req.body.pcode];
    sql = db.query (sqlQuery, data, (err, row) => {
        result(JSON.stringify(row[0]));
        if(err) { logger.error(err); }
        else { res.json(row[0]); }
    });
});

router.post('/search', (req, res)=> {
    sqlQuery = "SELECT * FROM product WHERE pname LIKE ? ;";
    data = [req.body.search];

    sql = db.query (sqlQuery, data, (err, row) => {
        result(row.length);
        if(err) { logger.error(err); }
        else { res.json(row); }
    });
});

router.post('/type', (req, res)=> {
    if(req.body.type === '랭킹'){
        sqlQuery = "SELECT * FROM product ORDER BY sales DESC;";
    }else{
        data = [req.body.type];
        sqlQuery = db.format("SELECT * FROM product WHERE type LIKE ? ;", data);
    }

    sql = db.query (sqlQuery, (err, row) => {
        result(row.length);
        if(err) { logger.error(err); }
        else { res.json(row); }
    });
});




//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;