const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');

let data, sqlQuery, sql;

router.post('/buying', (req, res)=>{
    let buyingList = req.body.buyingList;

    sqlQuery = "SELECT CREATE_OCODE_FC() AS oCode;";
    sql = db.query(sqlQuery, (err, row)=>{
        if(err) logger.error(err);
        else{
            result(JSON.stringify(row[0]));
            // 주문 title 테이블에 저장할 쿼리
            let sqlQuery1 = " INSERT INTO orderTitle(ocode, totalQuantity, totalPrice, cid, ph, recipient, zonecode, address, detailAddress) VALUES (?,?,?,?,?,?,?,?,?) ;";
            let query1Param = [
                row[0].oCode, req.body.totalQuantity, req.body.totalPrice, req.user.cid,
                req.body.deliveryInfo.ph, req.body.deliveryInfo.recipient,
                req.body.deliveryInfo.zonecode, req.body.deliveryInfo.address, req.body.deliveryInfo.detailAddress
            ]

            let query1 = db.format(sqlQuery1, query1Param)

            // 주문 detail 테이블에 저장할 쿼리
            let sqlQuery2 = " INSERT INTO orderDetail(ocode, cid, pcode, pname, quantity, price) VALUES (?,?,?,?,?,?) ; ";
            let query2 = "";
            buyingList.map(product =>{
                let query2Param = [row[0].oCode, req.user.cid, product.pcode, product.pname, product.quantity, (product.price * product.quantity) ];
                return query2 += db.format(sqlQuery2, query2Param);
            });

            let sqlQuery3, query3Param;
            logger.info("req.body.saveAddr"+req.body.saveAddr);
            if(req.body.saveAddr){  //만약 새로운 배송지 정보를 기본 배송지로 저장한다면
                // 기본 주소지 변경 + 포인트 차감
                sqlQuery3 = " UPDATE customer SET point = point-?, zonecode = ?, address = ?, detailAddress = ? WHERE cid = ? ;" ;
                query3Param = [Number(req.body.usePoint), req.body.deliveryInfo.zonecode, req.body.deliveryInfo.address, req.body.deliveryInfo.detailAddress, req.user.cid];
            }else{
                // 고객 테이블 point 차감
                 sqlQuery3 = " UPDATE customer SET point = point-? WHERE cid = ? ;" ;
                 query3Param = [Number(req.body.usePoint), req.user.cid];
            }
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
    sqlQuery = "SELECT * FROM orderTitle WHERE cid = ? AND odate BETWEEN ? AND ? ORDER BY odate DESC ;";
    let sqlQuery2 = "SELECT * FROM orderDetail WHERE cid = ? AND odate BETWEEN ? AND ? ORDER BY odate DESC ;";
    data = [req.user.cid, req.body.prevDate, req.body.nowDate];

    let sqlQuery3 = "SELECT pcode, images FROM product WHERE pcode = ? ;";

    let query1 = db.format(sqlQuery, data);
    let query2 = db.format(sqlQuery2, data);

    sql = db.query(query1 + query2, (err, row)=>{
        if(err) logger.error(err);
        else {
            let result1 = row[0];
            let result2 = row[1]
            logger.debug('SQL 결과1 : '+ query1 + ' ☞ ' + result1.length);
            logger.debug('SQL 결과2 : '+ query2 + ' ☞ ' + result2.length);

            //중복되는 pcode를 제외하기 위함
            let pcodes = result2.reduce((pcode, row) => {
                if(!pcode.includes(row.pcode)) pcode.push(row.pcode);
                return pcode;
            },[]);

            let query3 = "";
            pcodes.map((pcode) => { return query3 += db.format(sqlQuery3, pcode);});

            db.query(query3, (err, row2)=>{
                if(err) logger.error('sql2 에러 : ' + err);
                else{
                    logger.debug(sqlQuery3 +' → ' + row2.length);

                    // 이렇게 안하면 모양이 [[{}}] 배열 내 배열 내 객체의 형태가 됨.
                    // 꺼내려면 images[0].[0].images 이렇게 해야돼서... 보내주기 전에 2중 배열 제거!
                    let img = row2.map((row) =>{ return row[0]; });

                    res.json({
                        orderTitle: result1,
                        orderDetail: result2,
                        images: img
                    });
                }// end of if()
            })// end of sql2
        }
    })
})

//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;