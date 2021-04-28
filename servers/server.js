const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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
// const flash = require('connect-flash');
/**********라우트 목록**********/
const apiRoute = require('./routes/apiRoute');
const customerRoute = require('.././servers/routes/customerRoute');
const productRoute = require('.././servers/routes/productRoute');
const boardRoute = require('.././servers/routes/boardRoute');

// 반드시 session이후에 passport.initialize()와 passport.session()이 위치해야 합니다.
app.use(session({
    secret: 'hafProject',
    resave: false,   //공홈에는 이래되어있던데 뭔지 체크하고 주석풀든하자...
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000  },
}));

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// // 출처: https://3dmpengines.tistory.com/1881
// app.use(bodyParser.urlencoded({ extended: false }));            // post 방식 세팅
// app.use(bodyParser.json());                                     // json 사용 하는 경우의 세팅

app.use(express.json()); // json으로 받아들인 정보를 분석함
// 아래 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    let user;
    logger.info('그냥 / 요청')
    if(!req.user){
        user = [];
    }else{
        let cid = req.user.cid;
        let grade = req.user.grade;
        let name = req.user.name;
        user = {"cid": cid, "grade" : grade, "name": name};
    }
    res.json(user);
})

app.use('/api', apiRoute);

app.use('/customer', customerRoute);

app.use('/product', productRoute);

app.use('/board', boardRoute);




app.listen(port, () => {
    logger.debug(`SERVER ON ... Express is running on http:localhost:${port}`);
});
