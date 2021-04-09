const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');

router.post("/checkId", (req,res)=>{

    let cId = req.body.cId;     //req는 데이터를 받은건데 join.js에서 cID라는 key의 data를 보내줌
    logger.info('check id 값: ' + cId);

    let sqlQuery = "SELECT COUNT(*) FROM haf_db.customer WHERE cid = ?"
    db.query(sqlQuery,[cId], (err, row) => {
            if(!err) {
                // https://pythonq.com/so/mysql/280172
                logger.info( sqlQuery + ' 실행 결과 : ' + row[0]['COUNT(*)']);
                //res.send([body])의 인자값으론 Buffer object, String, object, Array만 가능한데 위의 코드에선 인자값으로 Integer 값이 들어갔기 대문에 오류 발생.
                res.send(row[0]['COUNT(*)'].toString());
            } else {
                logger.info(err);
            }
        });
});


module.exports = router;