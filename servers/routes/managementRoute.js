const express = require('express');
const router = express.Router();
const db = require('../../servers/config/db');
const { result, formatQuery, makingInsertQuestionMark} = require('../common/db_common');
const multer = require("multer");

let data, sqlQuery, sql;
let resData;

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

// const upload = multer({ storage: storage }).single("file");
const upload = multer({ storage: storage });

router.post('/image', upload.single("file"), (req, res) =>{
    resData = { result: 0, filePath: "", fileName: "" }
    //가져온 이미지를 저장을 해주면 된다요
    if(req.file) {
        resData.result = 1;
        resData.filePath = req.file.path;
        resData.fileName = req.file.filename;
    }else{
        logger.error("사진 저장 실패");
    }
    res.json(resData);
})

// 상품 추가
router.post('/addProduct', (req, res) =>{
    resData = { result: 0 }
    db.getConnection((err, connection)=>{
        try{

            let column = [ "pcode", "type", "pname", "description", "price", "continents", "images" ];

            let questionMark = makingInsertQuestionMark(column, {column: "pcode", value: "CREATE_PCODE_FC()"})

            sqlQuery = ` INSERT INTO product( ${column} ) VALUES (${questionMark}) ;`;
            data = [req.body.type, req.body.pname, req.body.description, req.body.price ,req.body.continents, req.body.images ];
            // logger.info('여기서 이미지 값 내용은? ' + req.body.images);
            sql = connection.query(formatQuery(connection, sqlQuery, data), (err, row) => {
                //insert 가 정상적으로 적용되었는지 판단하는 방법은 result.affectedRows를 활용합니다. (update, delete도 동일)
                result(sql,row.affectedRows);
                if(err) {
                    logger.error(err);
                    throw err;
                }
                if(row.affectedRows > 0) resData.result = 1;
                res.json(resData);
            })
        }catch (err) {
            logger.error(err)
        }finally {
            connection.release();
        }
    });//end of getConnection()
})

module.exports = router;