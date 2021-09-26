# React + Node.js 활용 건강보조식품 쇼핑몰 페이지
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## 당건책

당신의 건강을 책임진다는 의미로 쇼핑몰이름을 지었다.\
HAF는 Health Assistance Food의 약자로 의미 그대로 건강보조식품이다.

## 디렉토리 구조
├─public\
│  │  favicon.ico  알약모양의 홈페이지 파비콘\
│  │  index.html\
│  │  logo192.png\
│  │  logo512.png\
│  │  manifest.json\
│  │  navBasket_Icon.png 장바구니 아이콘\
│  │  navLogo.png 로고 이미지\
│  │  navUser_Icon.png 유저 아이콘\
│  │  robots.txt\
│  │  \
│  ├─banner 메인페이지 상단 슬라이드 이미지\
│  │      \
│  └─detailInfo 상품 상세화면 내 상세정보\
│          \
├─servers node.js 서버\
│  │  server.js 서버 index파일\
│  │  \
│  ├─config 서버 설정\
│  │      db.js mySQL과 연동위함. 보안상 gitignore되어있음\
│  │      logger.js winston라이브러리를 통해 console 창과 폴더에 log기록을 남기기 위함\
│  │      morganMiddleware.js morgan라이브러리를 통해 winston로그를 보기 좋게 출력해줌\
│  │          \
│  ├─passport 로그인 모듈\
│  │      index.js\
│  │      localStrategy.js 사용자 정보가 저장되는 저장소 관리\
│  │      \
│  └─routes 서버 라우트 관리\
│          apiRoute.js '/api'로 시작하는 요청\
│          boardRoute.js '/board'로 시작하는 요청 (게시판 관련)\
│          customerRoute.js /customer'로 시작하는 요청(회원 관련)\
│          managementRoute.js /management'로 시작하는 요청(관리자모드 관련)\
│          orderRoute.js /order'로 시작하는 요청(주문 관련)\
│          passportMw.js passport모듈 활용 미들웨어\
│          productRoute.js /product'로 시작하는 요청(상품 관련)\
│          \
├─src\
│  │  App.css\
│  │  App.js\
│  │  App.test.js\
│  │  App2.js\
│  │  index.css\
│  │  index.js\
│  │  logo.svg\
│  │  reportWebVitals.js\
│  │  setupProxy.js\
│  │  setupTests.js\
│  │  \
│  ├─components\
│  │  ├─board\
│  │  │      BoardList.js\
│  │  │      Inquiry.js\
│  │  │      InquiryList.js\
│  │  │      inquiryList2.js\
│  │  │      MyBoardList.js\
│  │  │      Review.js\
│  │  │      ReviewList.js\
│  │  │      reviewList2.js\
│  │  │      \
│  │  ├─customer\
│  │  │      ChangeCpw.js\
│  │  │      Join.js\
│  │  │      Login.js\
│  │  │      Mypage.js\
│  │  │      \
│  │  ├─home\
│  │  │      CalrouselImages.js\
│  │  │      CommonProductInformations.js\
│  │  │      DaumPostcodeAPI.js\
│  │  │      DetailInfo.js\
│  │  │      FileUpload.js\
│  │  │      Footer.js\
│  │  │      NavBar.js\
│  │  │      NavBar2.js\
│  │  │      Terms.js\
│  │  │      tooltipContent.js\
│  │  │      \
│  │  ├─management\
│  │  │      Management.js\
│  │  │      UploadProduct.js\
│  │  │      \
│  │  ├─order\
│  │  │      Basket.js\
│  │  │      Payment.js\
│  │  │      PaymentDetails.js\
│  │  │      PaymentList.js\
│  │  │      \
│  │  └─product\
│  │          ProductDetail.js\
│  │          ProductMain.js\
│  │          SearchProduct.js\
│  │          \
│  ├─router\
│  │      BoardRouter.js\
│  │      CustomerRouter.js\
│  │      OrderRouter.js\
│  │      ProductRouter.js\
│  │      \
│  └─store\
│      │  store.js\
│      │  \
│      ├─actions\
│      │      basketActions.js\
│      │      loginActions.js\
│      │      \
│      └─reducers\
│              basketReducer.js\
│              loginReducer.js\
│              reducer.js\
│              \
└─uploads\
        1620716389870_black.png\
        1620716505812_purple.png\
        1620716564576_blue.png\
        1620716606264_green.png\
        1620716678616_yellow.png\
        1620716723890_orange.png\
        1620716742261_red.png\
