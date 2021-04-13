const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');

let data, sqlQuery, sql;

// 아이디 중복 체크
router.post("/checkId", (req,res)=>{
    sqlQuery = " SELECT COUNT(*) FROM customer WHERE cid = ? ";
    data = req.body.cId;     //req는 데이터를 받은건데 join.js에서 cID라는 key의 data를 보내줌

    sql = db.query(sqlQuery, data, (err, row) => {
            if(!err) {
                // https://pythonq.com/so/mysql/280172
                result(row[0]['COUNT(*)']);
                //res.send([body])의 인자값으론 Buffer object, String, object, Array만 가능한데 위의 코드에선 인자값으로 Integer 값이 들어갔기 대문에 오류 발생.
                res.send(row[0]['COUNT(*)'].toString());
            } else {
                logger.error(err);
            }
        });
});

// 회원가입
router.post('/join', (req, res) => {
    sqlQuery = " INSERT INTO customer(cid, name, cpw, ph, email, address, detailAddress) VALUES (?, ?, ?, ?, ?, ?, ?) ";
    data = [
        req.body.cId, req.body.name, req.body.cPw, req.body.ph, req.body.email, req.body.address, req.body.detailAddress
    ];

    sql = db.query(sqlQuery, data, (err, row) => {
            //insert 가 정상적으로 적용되었는지 판단하는 방법은 result.affectedRows를 활용합니다. (update, delete도 동일)
            if(!err) {
                result(row.affectedRows);
                res.json(row.affectedRows.toString());
            } else {
                logger.error(err);
            }
    })
});

//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;