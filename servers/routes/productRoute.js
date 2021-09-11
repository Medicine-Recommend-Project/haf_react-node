const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin } = require('./passportMw');
const {result, formatQuery} = require("../common/db_common")

let data, sqlQuery, sql;
let resData = { };

let showDataCount = 5; // 한 화면에 보여줄 data 수
let currentPage = 1;    // 현재 페이지 번호
let startIdx;   // 조회 시 불러올 시작 idx
let endPage;    // 마지막 페이지 번호

router.post('/products', (req, res)=> {
    resData = { result: 0, products: [], endPage: 1}
    if(req.body.currentPage) currentPage = req.body.currentPage;
    if(req.body.showDataCount) showDataCount = req.body.showDataCount;

    db.getConnection((err, connection)=>{
        try{
            //전체 상품의 수 구하기
            sqlQuery = "SELECT COUNT(pcode) AS count FROM product ;";
            sql = connection.query(formatQuery(connection, sqlQuery), (err, row1)=>{
                result(sql, row1[0]['count']);
                if(err){
                    logger.error(err);
                    throw(err);
                }
                if(row1[0]['count'] > 0){
                    endPage = Math.ceil(row1[0]['count'] / showDataCount);   // ceil = 올림
                    startIdx = (currentPage - 1) * showDataCount;

                    // logger.info('startIdx: '+startIdx+' showDataCount: '+showDataCount+' currentPage: '+currentPage+ ' endPage: '+ endPage);
                    sqlQuery = "SELECT * FROM product ORDER BY pcode LIMIT ?, ? ;";
                    data = [startIdx, showDataCount];

                    sql = connection.query (formatQuery(connection, sqlQuery, data), (err, row2) => {
                        result(sql, row2.length);
                        if(err){
                            logger.error(err);
                            throw(err);
                        }
                        if(row2.length > 0) {
                            resData.result = 1;
                            resData.products = row2;
                            resData.endPage = endPage;
                        }
                        res.json(resData);
                    });//end of 2nd query()
                }else{
                    res.json(resData);
                }
            });//end of 1st query()
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
});


// 게시판작성 시 상품 고를 수 있게 해주는거 + 로딩되는 김에 로그인 유저 아이디랑 이름 가져가기
router.get("/getPcode", isLogin, (req,res)=>{
    resData = { result: 0, row: [], cid: req.user.cid, cname: req.user.cname}
    db.getConnection((err, connection)=>{
        try{
            sqlQuery = " SELECT pcode, pname FROM product ;";
            sql = connection.query(formatQuery(connection, sqlQuery), (err, row) => {
                result(sql, row.length);
                if(err){
                    logger.error(err);
                    throw(err);
                }
                if(row.length > 0){
                    resData.result = 1
                    resData.row = row;
                }
                res.json(resData);
            });
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
});

router.post('/detail', (req, res)=> {
    resData = { result: 0, product: {} }
    db.getConnection((err, connection)=>{
        try{
            sqlQuery = "SELECT * FROM product WHERE pcode = ?";
            data = [req.body.pcode];
            sql = connection.query (formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql, JSON.stringify(row[0]));
                if(err) {
                    logger.error(err);
                    throw err;
                }
                if(row.length > 0) {
                    resData.result = 1;
                    resData.product = row[0];
                }
                res.json(resData);
            });
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()

});

router.post('/search', (req, res)=> {
    sqlQuery = "SELECT * FROM product WHERE pname LIKE ? ;";
    data = [req.body.search];

    sql = connection.query (sqlQuery, data, (err, row) => {
        result(sql, row.length);
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

    sql = connection.query (sqlQuery, (err, row) => {
        result(sql, row.length);
        if(err) { logger.error(err); }
        else { res.json(row); }
    });
});




//console 창에 결과 출력하게 해주는 것
// let result = (result) =>{
//     logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
// }

module.exports = router;