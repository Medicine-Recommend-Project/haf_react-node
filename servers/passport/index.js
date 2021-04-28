const db = require('../../servers/config/db');
const passport = require('passport');
const local = require('./localStrategy');
let data, sqlQuery, sql;

/**
 * mySQL이랑 연동 되어있는 곳 : https://gaemi606.tistory.com/entry/Nodejs-Passportjs-passport-local-MySQL?category=744526
 * 강사같은 분이 하는 곳 : https://www.zerocho.com/category/NodeJS/post/57b7101ecfbef617003bf457
 * 몽고DB이긴한데 나름 상세 설명 : https://m.blog.naver.com/PostView.nhn?blogId=pjok1122&logNo=221565691611&proxyReferer=https:%2F%2Fwww.google.com%2F
 * req.flash 안될 때 라이브러리 적용 법? : https://heodang-repository.tistory.com/31
 * 마지막에 파일 별로 passport 나누면서 적용한 곳 : https://lgphone.tistory.com/95
 */

module.exports = () => {

//로그인 성공 시 실행되는 done(null, user);에서 user 객체를 전달받아 세션(정확히는 req.session.passport.user)에 저장
    passport.serializeUser(function (user, done) {   // Strategy 성공 시 호출됨
        logger.info("serializeUser : " + JSON.stringify(user));
        done(null, user);    // 여기의 user가 req.session.passport.user에 저장
    });

//로그인에 성공하고, 페이지를 방문할 때마다 세션 정보(serializeUser에서 저장됨)를 실제 DB의 데이터와 비교
    passport.deserializeUser(function (user, done) {   // 매개변수 id는 serializeUser의 done의 인자 user를 받은 것
        // logger.info("deserializeUser", JSON.stringify(user));
        logger.info("deserializeUser");
        sqlQuery = 'SELECT cid, grade, name FROM customer WHERE cid = ?';
        data = [user.cid]
        sql = db.query(sqlQuery, data, (err, row) => {
            logger.debug('SESSION SQL 결과 : ' + sql.sql + ' ☞ ' + JSON.stringify(row[0]));
            if (err) {
                logger.error('mysql 에러');
                return done(err);
            } else {
                if (row.length === 0) return done(null, false);
                // user = JSON.stringify(row[0]);
                let user = {cid: row[0].cid, grade: row[0].grade, name: row[0].name}
                return done(null, user);   // 여기의 user가 req.user가 됨
            }
        });//end of query
    });

    local();
}
