const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../servers/config/db');

// const bcrypt = require('bcrypt');
//https://lgphone.tistory.com/95

let data, sqlQuery, sql;

module.exports = () => {
// 실질적으로 로그인 시 사용자 확인 후 세션 생성해주는 곳
    passport.use(new LocalStrategy({   // Local 저장 방식을 통한 인증 구현
        usernameField: 'cid',   // 폼 필드로부터 아이디와 비밀번호를 전달받을 지 설정하는 옵션
        passwordField: 'cpw',
        session: true, // 세션에 저장 여부
    },(username, password, done) => {
        sqlQuery = "SELECT cid, grade, name FROM customer WHERE cid = ? AND cpw = ? "; //비밀번호 틀렸다고 경고창 띄울거면 cid =?만 하고 밑에서 결과값이랑 위에서 받은 password랑 비교하면 됨
        data = [username, password];
        sql = db.query(sqlQuery, data, (err, row)=> {
            logger.http('LocalStrategy start');
            logger.debug('SESSION SQL 결과 : ' + sql.sql + ' ☞ ' + JSON.stringify(row[0]));
            if(err){
                logger.error('LocalStrategy sql 에러' + err);
                return done(err); // 서버 에러 처리
            }else {
                if(row.length === 0){   //해당하는 유저가 없다잉
                    logger.info('조회 회원 결과 : ' + row.length);
                    return done(null, false); // done(에러, 성공, 사용자정의 메시지)
                }else{
                    logger.info('로그인 성공')
                    let user = {cid: row[0].cid, grade: row[0].grade, name: row[0].name}; //session에 넣을 정보
                    // logger.info('로그인 성공 후 done에 넣기 전 user 정보 : '+ JSON.stringify(user));
                    return done(null, user);     // result 값으로 받아진 회원정보를 return 해줌
                }
            }//end of if
        });//end of db.query()
    })); // return 받은 회원정보는 세션에 저장되는데, 이 세션을 정의하는 태그가 필요합니다. 그게 serializeUser, deserializeUser

};

