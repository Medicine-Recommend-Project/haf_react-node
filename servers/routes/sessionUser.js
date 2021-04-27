const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
// const flash = require('connect-flash');
// router.use(flash());   // flash message는 기본적으로 session을 사용하고 있기 때문에 세션 미들웨어 다음에 위치시켜주셔야 합니다.

let data, sqlQuery, sql;


/**
 * mySQL이랑 연동 되어있는 곳 : https://gaemi606.tistory.com/entry/Nodejs-Passportjs-passport-local-MySQL?category=744526
 * 강사같은 분이 하는 곳 : https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457
 * 몽고DB이긴한데 나름 상세 설명 : https://m.blog.naver.com/PostView.nhn?blogId=pjok1122&logNo=221565691611&proxyReferer=https:%2F%2Fwww.google.com%2F
 * req.flash 안될 때 라이브러리 적용 법? : https://heodang-repository.tistory.com/31
 */


// req.session을 통해 세션에 접근할 수 있으며, 생성도 가능합니다.
//세션 생성 : req.session.세션명 = 세션 value;


router.get('/', (req, res) => {
    let user = null;
    logger.info('그냥 / 요청')
    if(!req.user){
        user = [];
    }else{
        let cid = req.user.cid;
        let grade = req.user.grade;
        user = {"cid": cid, "grade" : grade};
    }
    res.json(user);
})

// 로그인 일단 /user/login으로 오게 해놨음
router.post('/login', function(req, res, next){
    logger.info(' login router로 잘 왔음');
    passport.authenticate('local', function(err, user, info){
            if(err){ return next(err); }
            if(user){   // 로그인 성공
                // let json = JSON.parse(JSON.stringify(user));
                logger.info('req.user : ' + JSON.stringify(user));
                req.logIn(user, err =>{ // customCallback 사용시 req.logIn()메서드 필수
                    if(err){ return next(err); }
                    logger.info('login()함수까지 왔다!!! ' + JSON.stringify(user))
                    return res.json(user);
                }); // end of req.login()
            } else{
                logger.error('login 실패!!!');
                res.json('false');
            }
        })(req, res, next)//end of authenticate();
    });


router.get('/logout', function(req, res){
    req.logout();
    // res.redirect('/');
    res.send('true')
});

// 실질적으로 로그인 시 사용자 확인 후 세션 생성해주는 곳
passport.use(new LocalStrategy({   // Local 저장 방식을 통한 인증 구현
        usernameField: 'cId',   // 폼 필드로부터 아이디와 비밀번호를 전달받을 지 설정하는 옵션
        passwordField: 'cPw',
        session: true, // 세션에 저장 여부
},(username, password, done) => {
        sqlQuery = "SELECT cid, grade FROM customer WHERE cid = ? AND cpw = ? "; //비밀번호 틀렸다고 경고창 띄울거면 cid =?만 하고 밑에서 결과값이랑 위에서 받은 password랑 비교하면 됨
        data = [username, password];
        sql = db.query(sqlQuery, data, (err, row)=> {
            logger.http('LocalStrategy start');
            result(JSON.stringify(row[0]));
            if(err){
                logger.error('LocalStrategy sql 에러' + err);
                return done(err); // 서버 에러 처리
            }else {
                if(row.length === 0){   //해당하는 유저가 없다잉
                    logger.info('조회 회원 결과 : ' + row.length);
                    return done(null, false); // done(에러, 성공, 사용자정의 메시지)
                }else{
                    logger.info('로그인 성공')
                    let user = {cid: row[0].cid, grade: row[0].grade}; //session에 넣을 정보
                    // logger.info('로그인 성공 후 done에 넣기 전 user 정보 : '+ JSON.stringify(user));
                    return done(null, user);     // result 값으로 받아진 회원정보를 return 해줌
                }
            }//end of if
        });//end of db.query()
})); // return받은 회원정보는 세션에 저장되는데, 이 세션을 정의하는 태그가 필요합니다. 그게 serializeUser, deserializeUser


//로그인 성공 시 실행되는 done(null, user);에서 user 객체를 전달받아 세션(정확히는 req.session.passport.user)에 저장
passport.serializeUser(function(user, done) {   // Strategy 성공 시 호출됨
    logger.info("serializeUser : " + JSON.stringify(user));
    done(null, user);    // 여기의 user가 req.session.passport.user에 저장
});

//로그인에 성공하고, 페이지를 방문할 때마다 세션 정보(serializeUser에서 저장됨)를 실제 DB의 데이터와 비교
passport.deserializeUser(function(user, done) {   // 매개변수 id는 serializeUser의 done의 인자 user를 받은 것
    // logger.info("deserializeUser", JSON.stringify(user));
    logger.info("deserializeUser");
    sqlQuery = 'SELECT cid, grade FROM customer WHERE cid = ?';
    sql = db.query(sqlQuery , [user.cid], (err, row) =>{
        result(JSON.stringify(row[0]));
        if(err){
            logger.error('mysql 에러');
            return done(err);
        } else{
            if(row.length === 0) return done(null, false);
            // user = JSON.stringify(row[0]);
            let user = {cid: row[0].cid, grade: row[0].grade}
            return done(null, user);   // 여기의 user가 req.user가 됨
        }
    });//end of query
});

















//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SESSION SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;