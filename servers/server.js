const express = require('express');
const app = express();
const port =process.env.PORT || 3001;
/**********로거 출력용 logger, morgan**********/
global.logger || (global.logger = require('./config/logger'));  // → 전역에서 사용
const morganMiddleware = require('./config/morganMiddleware');
app.use(morganMiddleware);  // 콘솔창에 통신결과 나오게 해주는 것
/**********로그인 세션 관리**********/
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
/**********라우트 목록**********/
const apiRoute = require('./routes/apiRoute');
const customerRoute = require('.././servers/routes/customerRoute');
const productRoute = require('.././servers/routes/productRoute');
const boardRoute = require('.././servers/routes/boardRoute');
const orderRoute = require('.././servers/routes/orderRoute');
const managementRoute = require('.././servers/routes/managementRoute');

// 반드시 session이후에 passport.initialize()와 passport.session()이 위치해야 합니다.
app.use(session({
    secret: 'hafProject',   //세션 암호화
    resave: false,  //세션을 항상 저장할지 여부를 정하는 값. (false 권장)
    saveUninitialized: true ,   //초기화되지 않은채 스토어에 저장되는 세션
    // cookie: { secure: false, maxAge: 60000  },
}));

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use(express.json()); // json으로 받아들인 정보를 분석함
// 아래 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     let user;
//     logger.info('그냥 / 요청')
//     if(!req.user){
//         user = [];
//     }else{
//         let cid = req.user.cid;
//         let grade = req.user.grade;
//         let name = req.user.name;
//         user = {"cid": cid, "grade" : grade, "name": name};
//     }
//     res.json(user);
// })

app.use('/api', apiRoute);

app.use('/customer', customerRoute);

app.use('/product', productRoute);

app.use('/board', boardRoute);

app.use('/order', orderRoute);

app.use('/management', managementRoute);

app.use('/uploads', express.static('uploads')); //uploads 폴더로 이동



app.listen(port, () => {
    logger.debug(`SERVER ON ... Express is running on http:localhost:${port}`);
});
