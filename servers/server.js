const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const apiRoute = require('./routes/apiRoute');
const customerRoute = require('.././servers/routes/customerRoute');
// 로거 출력용 logger, morgan
global.logger || (global.logger = require('./config/logger'));  // → 전역에서 사용
const morganMiddleware = require('./config/morganMiddleware');

app.use(morganMiddleware);

// 출처: https://3dmpengines.tistory.com/1881
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser.urlencoded({ extended: false }));            // post 방식 세팅
app.use(bodyParser.json());                                     // json 사용 하는 경우의 세팅
//post 방식 일경우 end


app.use('/api', apiRoute);

app.use('/customer', customerRoute);


app.listen(port, () => {
    logger.debug(`SERVER ON ... Express is running on http:localhost:${port}`);
});
