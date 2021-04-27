const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
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
    sqlQuery = " INSERT INTO customer(cid, name, cpw, ph, email, zonecode, address, detailAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";
    data = [
        req.body.cId, req.body.name, req.body.cPw, req.body.ph, req.body.email, req.body.zonecode, req.body.address, req.body.detailAddress
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

// mypage 접속 시 해당하는 유저 정보 가져감
router.post('/userinfo',(req, res)=>{
    sqlQuery = "SELECT * FROM customer WHERE cid = ? " ;
    data = req.body.cid ;

    sql = db.query(sqlQuery, data, (err, row)=>{
        if(err) {
            logger.error(err);
        }else{
            result(JSON.stringify(row[0]));
            res.json(row[0]);
        }
    })// end of query()
})

// mypage에서 회원 정보 수정하기
router.post('/mypage', (req, res)=>{
    sqlQuery = "UPDATE customer SET name = ?, email= ?, ph= ?, zonecode= ?, address= ?, detailAddress= ? WHERE cid = ?" ;
    data = [req.body.name, req.body.email , req.body.ph ,req.body.zonecode ,req.body.address ,req.body.detailAddress, req.body.cid];

    sql = db.query(sqlQuery, data, (err, row)=>{
        result(row.affectedRows);
        if(err){ logger.error(err); }
        else{ res.send(row.affectedRows.toString()); }
    })
})

// mypage에서 비밀번호 수정하기
router.post('/changeCpw', (req, res)=>{
    sqlQuery = "UPDATE customer SET cpw = ? WHERE cid = ? AND cpw = ?" ;
    data = [req.body.cpw, req.body.cid, req.body.oldCpw];

    sql = db.query(sqlQuery, data, (err, row)=>{
        result(row.affectedRows);
        if(err){ logger.error(err); }
        else{ res.send(row.affectedRows.toString()); }
    })
})







//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;