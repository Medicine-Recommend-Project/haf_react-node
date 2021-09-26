const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const passport = require('passport');
const { isLogin, isNotLogin } = require('./passportMw');
const { result, formatQuery, makingInsertQuestionMark, makingUpdateQuestionMark, matchingBodyNColumnData} = require('../common/db_common');

let data , sqlQuery, sql;
let resData;

router.get("/isLogin", isLogin, (req,res)=>{
    // 로그인 되어있는지 판별
    res.json(req.user);
})

router.get("/isNotLogin", isNotLogin, (req,res)=>{
    // 로그인 안되어있는지 판별
    res.json(req.user);
})

// 아이디 중복 체크
router.post("/checkId", (req,res)=>{
    resData = { result: 0, count: 1 }
    db.getConnection((err, connection)=>{
        try{
            sqlQuery = " SELECT COUNT(*) FROM customer WHERE cid = ? ";
            data = req.body.cid;

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql,row[0]['COUNT(*)']);
                if(err) {
                    logger.error(err);
                    throw err;
                }
                if(row[0]['COUNT(*)'] === 0) {
                    resData.result = 1;
                    resData.count = row[0]['COUNT(*)'];
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

// 회원가입
router.post('/join', isNotLogin, (req, res) => {
    resData = { result: 0 }
    db.getConnection((err, connection)=>{
        try{
            let column = ["cid", "cname", "cpw", "ph", "email", "zonecode", "address", "detailAddress"]
            let questionMark = makingInsertQuestionMark(column);
            sqlQuery = ` INSERT INTO customer(${column}) VALUES (${questionMark}) ;`;
            data = matchingBodyNColumnData(column, req.body);

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                result(sql, row.affectedRows);
                if(err) {
                    logger.error(err);
                    throw err;
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

// 로그인
router.post('/login', (req, res, next)=>{
    resData = { result: 0 }
    passport.authenticate('local', (err, user, info)=>{
        if(err){ return next(err); }
        if(user){   // 로그인 성공
            req.logIn(user, err =>{ // customCallback 사용시 req.logIn()메서드 필수
                if(err){ return next(err); }
                logger.info('req.login : ' + JSON.stringify(user))
                resData.result = 1;
            }); // end of req.login()
        } else{
            logger.error('login 실패!!!');
        }
        res.json(resData);
    })(req, res, next);  // 미들웨어 내 미들웨어에는 (req, res, next) 붙여줘야함
    //end of authenticate();
});

// 로그아웃
router.get('/logout', (req, res)=>{
    resData = { result: 0 }
    req.logout();
    req.session.destroy();
    resData.result = 1;
    res.json(resData);
});

// mypage 접속 시 해당하는 유저 정보 가져감
router.post('/userinfo', isLogin, (req, res)=>{
    resData = { result: 0, user: {} }
    db.getConnection((err, connection)=>{
        try{
            sqlQuery = "SELECT * FROM customer WHERE cid = ? " ;
            data = req.user.cid ;

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row)=>{
                result(sql, JSON.stringify(row[0]));
                if(err) {
                    logger.error(err);
                    throw err;
                }
                resData.result = 1;
                if(row.length > 0) resData.user = row[0];
                res.json(resData);
            })// end of query()
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()

})

// mypage에서 회원 정보 수정하기
router.post('/mypage', (req, res)=>{
    resData = { result: 0 }
    db.getConnection((err, connection)=>{
        try{
            let column = ["cname", "email", "ph", "zonecode", "address", "detailAddress"]
            let updatePart = makingUpdateQuestionMark(column);
            sqlQuery = `UPDATE customer SET ${updatePart} WHERE cid = ?` ;
            data = matchingBodyNColumnData(column, req.body, null, req.body.cid);

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row)=>{
                result(sql, row.affectedRows);
                if(err) {
                    logger.error(err);
                    throw err;
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
})

// mypage에서 비밀번호 수정하기
router.post('/changeCpw', (req, res)=>{
    resData = { result: 0 }
    db.getConnection((err, connection)=>{
        try{
            let column = ["cpw"];
            let updatePart = makingUpdateQuestionMark(column);
            sqlQuery = `UPDATE customer SET ${updatePart} WHERE cid = ? AND cpw = ? ;` ;
            data = [req.body.cpw, req.body.cid, req.body.oldCpw];

            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row)=>{
                result(sql,row.affectedRows);
                if(err) {
                    logger.error(err);
                    throw err;
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
})

module.exports = router;