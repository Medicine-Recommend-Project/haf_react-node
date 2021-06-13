# React + Node.js 활용 건강보조식품 쇼핑몰 페이지
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## 당건책

- 당신의 건강을 책임진다는 의미로 쇼핑몰이름을 지었다.\
HAF는 Health Assistance Food의 약자로 의미 그대로 건강보조식품이다.

## 디렉토리 구조
├─public\
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
│  │  \
│  ├─components\
│  │  ├─board 게시판 컴포넌트\
│  │  │      boardList.js\
│  │  │      inquiry.js\
│  │  │      inquiryList.js\
│  │  │      inquiryList2.js\
│  │  │      myBoardList.js\
│  │  │      review.js\
│  │  │      reviewList.js\
│  │  │      reviewList2.js\
│  │  │      \
│  │  ├─customer 고객 컴포넌트\
│  │  │      changeCpw.js\
│  │  │      join.js\
│  │  │      login.js\
│  │  │      mypage.js\
│  │  │      \
│  │  ├─home 공용 컴포넌트\
│  │  │      calrouselImages.js\
│  │  │      commonProductInformations.js\
│  │  │      DaumPostcodeAPI.js\
│  │  │      detailInfo.js\
│  │  │      FileUpload.js\
│  │  │      footer.js\
│  │  │      navBar.js\
│  │  │      navBar2.js\
│  │  │      terms.js\
│  │  │      tooltipContent.js\
│  │  │      \
│  │  ├─management 관리자 컴포넌트\
│  │  │      management.js\
│  │  │      uploadProduct.js\
│  │  │      \
│  │  ├─order 주문 컴포넌트\
│  │  │      basket.js\
│  │  │      payment.js\
│  │  │      paymentDetails.js\
│  │  │      paymentList.js\
│  │  │      \
│  │  └─product 상품 컴포넌트\
│  │          productDetail.js\
│  │          productMain.js\
│  │          searchProduct.js\
│  │          \
│  ├─router 라우터 관리\
│  │      boardRouter.js\
│  │      customerRouter.js\
│  │      orderRouter.js\
│  │      productRouter.js\
│  │      \
│  └─store 리덕스관리\
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
└─uploads 상품 메인 사진\
