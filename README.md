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
│  │  favicon.ico\
│  │  index.html\
│  │  logo192.png\
│  │  logo512.png\
│  │  manifest.json\
│  │  navBasket_Icon.png\
│  │  navLogo.png\
│  │  navUser_Icon.png\
│  │  robots.txt\
│  │  \
│  ├─banner\
│  │      bannerEnergy.png\
│  │      bannerMayEvent.png\
│  │      bannerOrganic.png\
│  │      \
│  └─detailInfo\
│          buttercup-6225833_640.jpg\
│          human-skeleton-163715_1280.jpg\
│          landscape-78058_1280.jpg\
│          nutrient-additives-505124_1280.jpg\
│          pills-3673645_1920.jpg\
│          \
├─servers\
│  │  server.js\
│  │  \
│  ├─config\
│  │      db.js\
│  │      logger.js\
│  │      morganMiddleware.js\
│  │          \
│  ├─passport\
│  │      index.js\
│  │      localStrategy.js\
│  │      \
│  └─routes\
│          apiRoute.js\
│          boardRoute.js\
│          customerRoute.js\
│          managementRoute.js\
│          orderRoute.js\
│          passportMw.js\
│          productRoute.js\
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
│  │  │      boardList.js\
│  │  │      inquiry.js\
│  │  │      inquiryList.js\
│  │  │      inquiryList2.js\
│  │  │      myBoardList.js\
│  │  │      review.js\
│  │  │      reviewList.js\
│  │  │      reviewList2.js\
│  │  │      \
│  │  ├─customer\
│  │  │      changeCpw.js\
│  │  │      join.js\
│  │  │      login.js\
│  │  │      mypage.js\
│  │  │      \
│  │  ├─home\
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
│  │  ├─management\
│  │  │      management.js\
│  │  │      uploadProduct.js\
│  │  │      \
│  │  ├─order\
│  │  │      basket.js\
│  │  │      payment.js\
│  │  │      paymentDetails.js\
│  │  │      paymentList.js\
│  │  │      \
│  │  └─product\
│  │          productDetail.js\
│  │          productMain.js\
│  │          searchProduct.js\
│  │          \
│  ├─router\
│  │      boardRouter.js\
│  │      customerRouter.js\
│  │      orderRouter.js\
│  │      productRouter.js\
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
