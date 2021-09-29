// 로그인 유무를 판별해주는 passport middleware 파일 https://lgphone.tistory.com/95
// 로그인이 되어있다면 req.isAuthenticated()가 true일 것이고, 그렇지 않다면 false

exports.isLogin = (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.send('ppfalse');  //로그인 안되어있다.
};

exports.isNotLogin = (req, res, next) => {
    if (!req.isAuthenticated()) next();
    else res.send('pptrue');  //로그인 되어있다.
};