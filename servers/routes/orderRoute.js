const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const {result, makingInsertQuestionMark, makingUpdateQuestionMark, formatArrayQueryArrayData} = require("../common/db_common")
let data, sqlQuery, sql;
let resData;

router.post('/buying', (req, res)=>{
    resData = { result: 0, ocode: "" }
    db.getConnection((err, connection)=>{
        try{
            let buyingList = req.body.buyingList;
            //이렇게 안하면 ocode가 증가했었나....
            sqlQuery = "SELECT CREATE_OCODE_FC() AS ocode;";
            sql = connection.query(sqlQuery, (err, row)=>{
                result(sql,JSON.stringify(row[0]));
                if(err){
                    logger.error(err);
                    throw(err);
                }
                const ocode = row[0].ocode;

                let column1 = ["ocode", "totalQuantity", "totalPrice", "cid", "ph", "recipient", "zonecode", "address", "detailAddress", "usePoint", "method"];
                let questionMark1 = makingInsertQuestionMark(column1);
                // 주문 title 테이블에 저장할 쿼리
                let sqlQuery1 = [`INSERT INTO orderTitle( ${column1} ) VALUES ( ${questionMark1} ) ;`];
                let data = [
                    [
                        ocode, req.body.totalQuantity, req.body.totalPrice, req.user.cid,
                        req.body.deliveryInfo.ph, req.body.deliveryInfo.recipient,
                        req.body.deliveryInfo.zonecode, req.body.deliveryInfo.address, req.body.deliveryInfo.detailAddress,
                        Number(req.body.usePoint), req.body.deliveryInfo.method
                    ]
                ]

                let column2 = ["ocode", "cid", "pcode", "pname", "quantity", "price"];
                let questionMark2 = makingInsertQuestionMark(column2);

                //주문 Detail용 쿼리랑 data 추가해주기
                buyingList.map( product =>{
                    sqlQuery1.push(` INSERT INTO orderDetail( ${column2} ) VALUES ( ${questionMark2} ) ; `);
                    data.push([ocode, req.user.cid, product.pcode, product.pname, product.quantity, (product.price * product.quantity)]);
                });

                //만약 새로운 배송지 정보를 기본 배송지로 저장한다면
                let column3 = ["point"];    //기본 적으로 사용하는 point
                if(req.body.saveAddr){
                    // 기본 주소지 변경 + 포인트 차감
                    column3.push("zonecode", "address", "detailAddress")
                    data.push([Number(req.body.usePoint), req.body.deliveryInfo.zonecode, req.body.deliveryInfo.address, req.body.deliveryInfo.detailAddress, req.user.cid])
                }else{
                    // 고객 테이블 point 차감
                    data.push([Number(req.body.usePoint), req.user.cid]);
                }
                let updateQuery3 = makingUpdateQuestionMark(column3, {column: "point", value: "point - ?"})
                sqlQuery1.push(` UPDATE customer SET ${updateQuery3} WHERE cid = ? ; `);
                let sql2 = connection.query( formatArrayQueryArrayData(connection, sqlQuery1, data), (err, row)=>{
                    let result1 = row[0].affectedRows;
                    let result2 = row[1].affectedRows;
                    let result3 = row[2].affectedRows;
                    result(sql2, `title: ${result1}, detail: ${result2}, customer: ${result3}`);
                    if(err){
                        logger.error(err);
                        throw(err);
                    }
                    if( result1 > 0 && result2 > 0 && result3 >= 0) {
                        resData.result = 1;
                        resData.ocode =ocode;
                    }
                    res.json(resData);
                }); // end of sql2
            }); // end of sql1
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()


});// end of router.post('/buying');

router.post('/paymentDetails',(req, res)=> {
    resData = {result: 0, orderTitle: [], orderDetail: []}
    db.getConnection((err, connection) => {
        try {
            let joinQuery = ` LEFT JOIN product product ON detail.pcode = product.pcode `;
            if (req.body.ocode === "%") {
                sqlQuery = [`SELECT * FROM orderTitle WHERE cid = ? AND odate BETWEEN ? AND ? ORDER BY odate DESC;`];
                sqlQuery.push(`SELECT detail.*, product.images
                               FROM orderDetail detail ${joinQuery}
                               WHERE cid = ? AND odate BETWEEN ? AND ?
                               ORDER BY odate DESC;`);
                data = [req.user.cid, req.body.prevDate, req.body.nowDate];
            } else {
                sqlQuery = [`SELECT * FROM orderTitle WHERE ocode LIKE ?;`];
                sqlQuery.push(`SELECT detail.*, product.images
                               FROM orderDetail detail ${joinQuery}
                               WHERE ocode LIKE ?;`);
                data = [req.body.ocode];
            }

            sql = connection.query(formatArrayQueryArrayData(connection, sqlQuery, data, true), (err, row) => {
                let result1 = row[0];
                let result2 = row[1];
                result(sql, `title: ${result1.length} , detail: ${result2.length}`);
                if (err) {
                    logger.error(err);
                    throw(err);
                }
                resData.result = 1;
                if(result1.length > 0) resData.orderTitle = result1;
                if(result2.length > 0) resData.orderDetail = result2;

                res.json(resData);
            }); // end of sql()
        } catch (err) {
            logger.error(err)
        } finally {
            connection.release();
        }
    });//end of getConnection()
})

module.exports = router;