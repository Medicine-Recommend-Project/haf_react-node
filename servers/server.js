const express = require('express');
const app = express();
// const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const apiRoute = require('./routes/apiRoute');


//  setupProxy.js파일에 proxy설정 해서 이건 안해도 됨( 외부에서 접근가능하게 하려면 주석치지 마시고요~)
// app.use(cors());

app.use(bodyParser.json());

//서버쪽에 더많은 api를 만들기위해 server.js 에 route 를 적용합니다.
/*
* app.use('/api/hello', (req, res) ) 뭐 이런거 여러개 만들기보다
* api로 들어오는 경로는 apiRoute라는 파일에서
* myPage로 들어오는 경로는 myPageRoute파일 이런식으로
* 관리하면 훨씬 깔끔할 듯
* */

app.use('/api', apiRoute);

app.listen(port, () => {
    console.log(`SERVER ON ... Express is running on ${port}`);
})