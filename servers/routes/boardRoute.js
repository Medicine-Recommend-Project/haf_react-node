const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin, isNotLogin } = require('./passportMw');

let data, sqlQuery, sql;

// 게시판 다 불러오기
router.post("/getBoards", (req,res)=>{
    sqlQuery = "SELECT * FROM board WHERE category LIKE ?";
    data = req.body.where;
    sql = db.query(sqlQuery, data, (err, row) => {
        if(!err) {
            result(row.length);
            res.json(row);
        } else {
            logger.error(err);
        }
    });
});

// 문의글 게시판
router.post("/inquiry", (req,res)=>{
    sqlQuery = "INSERT INTO board(cid, pcode, category, DetailCategory, title, content) VALUES(?, ?, ?, ?, ?, ?) ";
    data = [req.body.cid , req.body.pCode ,req.body.category ,req.body.DetailCategory ,req.body.title ,req.body.content]

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
router.post("/review", (req,res)=>{
    sqlQuery = "INSERT INTO board(cid, pcode, category, rating, title, content) VALUES(?, ?, ?, ?, ?, ?) ";
    data = [req.body.cid , req.body.pCode ,req.body.category ,req.body.rating ,req.body.title ,req.body.content]

    sql = db.query(sqlQuery, data, (err, row) => {
        if(!err) {
            result(JSON.stringify(row.affectedRows));
            res.json(row.affectedRows.toString());
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