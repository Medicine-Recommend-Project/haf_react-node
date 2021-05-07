const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const passport = require('passport');
const { isLogin, isNotLogin } = require('./passportMw');

let data, sqlQuery, sql;

router.post('/buying', (req, res)=>{
    let buyingList = req.body.buyingList;

    sqlQuery = "SELECT CREATE_OCODE_FC() AS oCode;";
    sql = db.query(sqlQuery, (err, row)=>{
        if(err) logger.error(err);
        else{
            result(JSON.stringify(row[0]));
            // 주문 title 테이블에 저장할 쿼리
            let sqlQuery1 = " INSERT INTO orderTitle(ocode, totalQuantity, totalPrice, cid, recipient, zonecode, address, detailAddress) VALUES (?,?,?,?,?,?,?,?) ;";
            let query1Param = [row[0].oCode, req.body.totalQuantity, req.body.totalPrice, req.user.cid, req.body.deliveryInfo.recipient, req.body.deliveryInfo.zonecode, req.body.deliveryInfo.address, req.body.deliveryInfo.detailAddress]
            let query1 = db.format(sqlQuery1, query1Param)

            // 주문 detail 테이블에 저장할 쿼리
            let sqlQuery2 = " INSERT INTO orderDetail(ocode, cid, pcode, pname, quantity, price) VALUES (?,?,?,?,?,?) ; ";
            let query2 = "";
            buyingList.map(product =>{
                let query2Param = [row[0].oCode, req.user.cid, product.pcode, product.pname, product.quantity, (product.price * product.quantity) ];
                return query2 += db.format(sqlQuery2, query2Param);
            });

            // 고객 테이블의 point 차감 쿼리
            let sqlQuery3 = " UPDATE customer SET point = point-? WHERE cid = ? ;" ;
            let query3Param = [Number(req.body.usePoint), req.user.cid];
            let query3 = db.format(sqlQuery3, query3Param);

            let sql2 = db.query(query1 + query2 + query3,(err, row)=>{
                if(err) logger.error('에러다 : '+err);
                else {
                    let result1 = row[0].affectedRows;
                    let result2 = row[1].affectedRows;
                    let result3 = row[2].affectedRows;

                    logger.debug(sql2.sql +' → title: '+ result1 +', detail: '+ result2 +', customer: '+ result3);
                    if( result1 > 0 && result2 > 0 && result3 >= 0) res.json('success');
                    else res.json('false');
                }
            }); // end of sql2
        }// end of if else
    }); // end of sql1
});// end of router.post('/buying');

router.post('/paymentDetail',(req, res)=>{
    sqlQuery = "SELECT * FROM orderDetail WHERE cid = ? AND odate BETWEEN ? AND ? ORDER BY odate DESC ";
    data = [req.user.cid, req.body.prevDate, req.body.nowDate];
    sql = db.query(sqlQuery, data, (err, row)=>{
        if(err) logger.error(err);
        else{
            result(row.length);
            res.json(row);
        }
    })
})

//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;