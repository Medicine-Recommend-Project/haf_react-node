const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const passport = require('passport');
const { isLogin, isNotLogin } = require('./passportMw');
const { result, formatQuery, makingInsertQuestionMark, makingUpdateQuestionMark, matchingBodyNColumnData} = require('../common/db_common');

let data, sqlQuery, sql;
let resData;

/*
//세션 스토어가 이루어진 후 redirect를 해야함.
            req.session.save(function(){                               (2)
                rsp.redirect('/');
            });
*/
router.get("/isLogin", isLogin, (req,res)=>{
    // 로그인 되어있는지 판별
    res.json(req.user);
})

router.get("/isNotLogin", isNotLogin, (req,res)=>{
    // 로그인 안되어있는지 판별
    res.json(req.user);
})


// 로그인
router.post('/login', (req, res, next)=>{
    resData = { result: 0 }
    passport.authenticate('local', (err, user, info)=>{
        if(err){ return next(err); }
        if(user){   // 로그인 성공
            req.logIn(user, err =>{ // customCallback 사용시 req.logIn()메서드 필수
                if(err){ return next(err); }
                res.cookie("c_auth", user.cid);
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
    res.clearCookie('c_auth');
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

module.exports = router;