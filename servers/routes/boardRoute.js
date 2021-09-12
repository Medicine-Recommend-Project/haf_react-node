const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin, isNotLogin } = require('./passportMw');
const {result, formatQuery, makingInsertQuestionMark, makingUpdateQuestionMark} = require("../common/db_common")

let data, sqlQuery, sql;
let resData;

// 게시판 다 불러오기
router.post("/getBoards", (req,res)=>{
    resData = { result: 0, boards: []}
    db.getConnection((err, connection)=>{
        try{
            sqlQuery = "SELECT * FROM board WHERE category LIKE ? AND pcode LIKE ? ;";
            data = [ req.body.where, req.body.pcode];
            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql,row.length);
                if(err){
                    logger.error(err);
                    throw(err);
                }
                resData.result = 1;
                if(row.length > 0) resData.boards = row;
                res.json(resData);
            });
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
});
// 내가 쓴 게시물 다 불러오기
router.post("/getMyBoards", isLogin, (req,res)=>{
    resData = { result: 0, boards: []}
    db.getConnection((err, connection)=>{
        try{
            sqlQuery = "SELECT * FROM board WHERE cid = ? AND category LIKE ? AND pcode LIKE ? ORDER BY bdate DESC ;";
            data = [ req.user.cid, req.body.where, req.body.pcode];

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql,row.length);
                if(err){
                    logger.error(err);
                    throw(err);
                }
                if(row.length > 0) resData.boards = row;
                res.json(resData);
            });
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
});

// 문의글 게시판
router.post("/inquiry", isLogin, (req,res)=>{
    resData = { result: 0 }
    db.getConnection((err, connection)=>{
        try{
            let column = ["cid", "pcode", "category", "DetailCategory", "title", "content"];
            let questionMark = makingInsertQuestionMark(column);

            sqlQuery = `INSERT INTO board( ${column} ) VALUES( ${questionMark} ) ;`;
            data = [req.body.cid , req.body.pcode ,req.body.category ,req.body.DetailCategory ,req.body.title ,req.body.content];

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql,row.affectedRows);
                if(err){
                    logger.error(err);
                    throw(err);
                }
                if(row.affectedRows > 0) resData.result = 1;
                res.json(resData);
            });
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
});

// 후기글 게시판
router.post("/review", isLogin, (req,res)=>{
    resData = { result: 0 }
    db.getConnection((err, connection)=>{
        try{
            let column = ["cid", "ocode", "pcode", "category", "rating", "title", "content"];
            let questionMark = makingInsertQuestionMark(column);

            sqlQuery = ` INSERT INTO board( ${column} ) VALUES( ${questionMark} ) ; `;
            data = [req.body.cid , req.body.pcode, req.body.pcode ,req.body.category ,req.body.rating ,req.body.title ,req.body.content];

            let column2 = ["addreview"];
            let updateQuery = makingUpdateQuestionMark(column2);
            sqlQuery += ` UPDATE orderDetail SET ${ updateQuery } WHERE ocode = ? AND pcode = ? AND cid = ? ;`;
            data.push('1', req.body.ocode, req.body.pcode, req.body.cid);

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql,row[0].affectedRows + " / " + row[1].affectedRows);
                if(err){
                    logger.error(err);
                    throw(err);
                }
                if(row[0].affectedRows > 0 && row[1].affectedRows > 0) resData.result = 1;
                res.json(resData);
            });
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
});

module.exports = router;