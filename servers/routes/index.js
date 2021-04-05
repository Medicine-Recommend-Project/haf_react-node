const express = require('express');
const router = express.Router();

/**
 * 여기서 /api 로오는것은 route 에서 처리하도록 하고
 * index.js 에서 router.get('/',...)  으로 되어있죠.
 * /api/ 다음으로 뒤에 오는것을 index.js 에서 정의하면 됩니다.
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



module.exports = router;