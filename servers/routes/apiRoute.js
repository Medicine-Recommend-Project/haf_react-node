const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');

/**
 * 여기서 /api 로오는것은 route 에서 처리하도록 하고
 * apiRoute.js 에서 router.get('/',...)  으로 되어있죠.
 * /api/ 다음으로 뒤에 오는것을 apiRoute.js 에서 정의하면 됩니다.
 */

// http:localhost:3000/api 로 요청
router.get('/', (req, res) => {
    res.json({username:'cute 혜지'});
});

// http:localhost:3000/api/group 으로 요청
// App.js의 fetch('api/group')로 바꿔주면 됨
router.get('/group', (req, res) => {
    res.json({username:'뽕뀨찌 group ~~'})
})

/** https://fe-flower.tistory.com/27?category=859209
 * 파일 상단에 DB커넥션 객체를 추가해주고
 * '/api/hello'로 데이터요청 발생시 쿼리를 날려 DB로부터 가져온 정보를 products라는 이름으로 보내줍니다.
 * (DB data는 배열형태로 가져옴)
 * */

router.get("/hello", (req,res)=>{

    db.query("SELECT * FROM haf_db.product", (err, data) => {
            if(!err) {
                res.send(data);

            } else {
                console.log(err);
                res.send(err);
            }
        });


});


module.exports = router;