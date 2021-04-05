const express = require('express');
const app = express();
// const cors = require('cors');
const bodyParser = require('body-parser');
const port =process.env.PORT || 3001;
const route = require('./routes/index');

//  setupProxy.js파일에 proxy설정 해서 이건 안해도 됨( 외부에서 접근가능하게 하려면 주석치지 마시고요~)
// app.use(cors());

app.use(bodyParser.json());

//서버쪽에 더많은 api를 만들기위해 server.js 에 route 를 적용합니다.
app.use('/api', route);

app.listen(port, () => {
    console.log(`express is running on ${port}`);
})