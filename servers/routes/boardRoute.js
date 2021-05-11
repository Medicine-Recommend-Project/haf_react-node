const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin, isNotLogin } = require('./passportMw');

let data, sqlQuery, sql;

// 게시판 다 불러오기
router.post("/getBoards", (req,res)=>{
    sqlQuery = "SELECT * FROM board WHERE category LIKE ? AND pcode LIKE ?";
    data = [ req.body.where, req.body.pcode];
    sql = db.query(sqlQuery, data, (err, row) => {
        if(err) {
            logger.error(err);
        } else {
            result(row.length);
            res.json(row);
        }
    });
});
// 내가 쓴 게시물 다 불러오기
router.post("/getMyBoards", isLogin, (req,res)=>{
    sqlQuery = "SELECT * FROM board WHERE cid = ? AND category LIKE ? AND pcode LIKE ? ORDER BY bdate DESC";
    data = [ req.user.cid, req.body.where, req.body.pcode];

    sql = db.query(sqlQuery, data, (err, row) => {
        if(err) {
            logger.error(err);
        } else {
            result(row.length);
            res.json(row);
        }
    });
});

// 문의글 게시판
router.post("/inquiry", isLogin, (req,res)=>{
    sqlQuery = "INSERT INTO board(cid, pcode, category, DetailCategory, title, content) VALUES(?, ?, ?, ?, ?, ?) ";
    data = [req.body.cid , req.body.pcode ,req.body.category ,req.body.DetailCategory ,req.body.title ,req.body.content]

    sql = db.query(sqlQuery, data, (err, row) => {
            if(!err) {
                result(JSON.stringify(row.affectedRows));
                res.json(row.affectedRows.toString());
            } else {
                logger.error(err);
            }
        });
});

// 후기글 게시판
router.post("/review", isLogin, (req,res)=>{
    sqlQuery = "INSERT INTO board(cid, ocode, pcode, category, rating, title, content) VALUES(?, ?, ?, ?, ?, ?, ?) ;";
    data = [req.body.cid , req.body.pcode, req.body.pcode ,req.body.category ,req.body.rating ,req.body.title ,req.body.content];

    let query1 = db.format(sqlQuery, data);

    let sqlQuery2 = "UPDATE orderDetail SET addreview = ? WHERE ocode = ? AND pcode = ? AND cid = ?;"
    let data2 = ['1', req.body.ocode, req.body.pcode, req.body.cid]

    let query2 = db.format(sqlQuery2, data2);

    sql = db.query(query1 + query2, (err, row) => {
        if(!err) {
            let rs = row[0].affectedRows + row[1].affectedRows; //2이상이 되어야 정상
            result(rs);
            res.json(rs.toString());
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