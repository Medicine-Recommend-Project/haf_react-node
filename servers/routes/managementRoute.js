const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { isLogin, isNotLogin } = require('./passportMw');
const { result} = require('../common/db_common');
const multer = require("multer");

let data, sqlQuery, sql;

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
/// ▲어디에 파일이 저장되는지.
        cb(null, 'uploads/')
        //      ▲모든파일이 업로드 파일에 들어감
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
        //         ▲업로드 파일에 무슨이름으로 넣을껀지 정함
    }
});

const upload = multer({ storage: storage }).single("file");

router.post('/image', (req, res) =>{
    //가져온 이미지를 저장을 해주면 된다요
    upload(req, res, err => {
        if(err) {
            logger.error(err);
            return req.json( {success:false, err} )
        }
        return res.json({
            success: true, filePath: res.req.file.path, fileName: res.req.file.filename,
        });
    })
})

// 상품 추가
router.post('/addProduct', (req, res) =>{

// 받아온 정보들을 DB에 넣어준다
    sqlQuery = " INSERT INTO product(pcode, type, pname, description, price, continents, images) VALUES (CREATE_PCODE_FC(), ?, ?, ?, ?, ?, ?) ";
    data = [req.body.type, req.body.pname, req.body.description, req.body.price ,req.body.continents, req.body.images ];
    // logger.info('여기서 이미지 값 내용은? ' + req.body.images);
    sql = db.query(sqlQuery, data, (err, row) => {
        //insert 가 정상적으로 적용되었는지 판단하는 방법은 result.affectedRows를 활용합니다. (update, delete도 동일)
        if(!err) {
            result(sql,row.affectedRows);
            res.json(row.affectedRows.toString());
        } else {
            logger.error(err);
        }
    })
})






//console 창에 결과 출력하게 해주는 것
// let result = (result) =>{
//     logger.debug('SQL 결과 : ' + sql.sql + ' ☞ ' + result);
// }

module.exports = router;