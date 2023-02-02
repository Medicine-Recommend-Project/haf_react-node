const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');

let sql;

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

    sql = db.query("SELECT * FROM product", (err, data) => {
            if(!err) {
                logger.debug(sql.sql);
                res.send(data);
            } else {
                logger.error(err);
                res.send(err);
            }
        });


});

router.post('/product/products', (req, res)=> {

    //찾아보니까 페이징 할 때 쓰는 거네...

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    // ▲req.body.limit가 String일때 숫자로 바꿔주는 역할 //limit에 지정된 숫자가 없다면 20으로 함
    let skip = req.body.skip ? parseInt(req.body.limit) : 0;
    let findArgs = {};

    // logger.error('req.body.filters : ' + req.body.filters);
    // logger.error('req.body.filters[0] : ' + req.body.filters[0]);
    // logger.error('req.body.filters[0][0] : ' + req.body.filters[0][0]);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {

            logger.info('key : ' + key);

            if (key === "price") {
                findArgs[key] = {
                    //Greater than equal
                    $gte: req.body.filters[key][0],
                    //Less than equal
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }

        }
    }
    sqlQuery = "SELECT * from testdb "
    sql = db.query(sqlQuery, (err, row) => {

        if (!err) {

            result(row.length);
            res.json(row);

        } else {
            logger.error(err);
        }
    });
});



//console 창에 결과 출력하게 해주는 것
let result = (result) =>{
    logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
}

module.exports = router;