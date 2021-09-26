const express = require('express');
const app = express();
const port =process.env.PORT || 3001;
/**********로거 출력용 logger, morgan**********/
global.logger || (global.logger = require('./config/logger'));  // → 전역에서 사용
const morganMiddleware = require('./config/morganMiddleware');
app.use(morganMiddleware);  // 콘솔창에 통신결과 나오게 해주는 것
/**********로그인 세션 관리**********/
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
const path = require("path");

// 반드시 session이후에 passport.initialize()와 passport.session()이 위치해야 합니다.
app.use(session({
    secret: 'hafProject',   //세션 암호화
    resave: false,  //세션을 항상 저장할지 여부를 정하는 값. (false 권장)
    saveUninitialized: false ,   //초기화되지 않은채 스토어에 저장되는 세션
    cookie: {
        httpOnly: true,
        secure: true,
        maxAge: 60000
    },
}));

app.use('/uploads', express.static('uploads')); //uploads 폴더로 이동

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use(express.json()); // json으로 받아들인 정보를 분석함
// 아래 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다
app.use(express.urlencoded({ extended: true }));


app.use('/api', apiRoute);

app.use('/api/customer', customerRoute);

app.use('/api/product', productRoute);

app.use('/api/board', boardRoute);

app.use('/api/order', orderRoute);

app.use('/api/management', managementRoute);

// will serve index.html for every page refresh.
//app.get("*", function(req, res) {
//    res.sendFile(path.join("C:\\workspace\\intelliJ\\hafProject\\haf\\public\\index.html"));
//});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => {
    logger.debug(`SERVER ON ... Express is running on http:localhost:${port}`);
});
