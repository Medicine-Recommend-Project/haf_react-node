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
                let data = {row: row, cid: req.user.cid, name: req.user.name}
                res.json(data);
                // res.json(row);
            } else {
                logger.error(err);
            }
        });
});







//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;