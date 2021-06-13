const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin, isNotLogin } = require('./passportMw');

let data, sqlQuery, sql;

let showDataCount = 5; // 한 화면에 보여줄 data 수
let currentPage = 1;    // 현재 페이지 번호
let startIdx;   // 조회 시 불러올 시작 idx
let endPage;    // 마지막 페이지 번호

router.post('/products', (req, res)=> {

    if(req.body.currentPage) currentPage = req.body.currentPage;
    if(req.body.showDataCount) showDataCount = req.body.showDataCount;

    let sqlQuery1 = "SELECT COUNT(pcode) AS count FROM product ;";
    sql = db.query(sqlQuery1, (err, row)=>{
        if(err){
            logger.error(err);
            throw(err);
        }else if(row[0]['count'] > 0){
            result(row[0]['count']);
            endPage = Math.ceil(row[0]['count'] / showDataCount);   // ceil = 올림

            startIdx = (req.body.currentPage - 1) * showDataCount;
            logger.info('startIdx: '+startIdx+' showDataCount: '+showDataCount+' currentPage: '+currentPage+ ' endPage: '+ endPage);
            sqlQuery = "SELECT * FROM product ORDER BY pcode LIMIT ?, ? ;";
            data = [startIdx, showDataCount];
            sql = db.query (sqlQuery, data, (err, row) => {
                result(row.length);
                if(err) { logger.error(err); }
                else if(row.length > 0) {
                    let rs ={
                        products: row,
                        endPage: endPage
                    }
                    res.json(rs);
                }else{
                    res.json({result: "false", endPage: 1});
                }
            });
        }
    });
});


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