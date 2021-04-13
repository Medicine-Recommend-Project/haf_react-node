import React from 'react';
import DaumPostcode from "react-daum-postcode";

// 출처 : https://ddeck.tistory.com/41

const DaumPostcodeAPI = (props) => {
    
    // 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
    const handlePostCode = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        // console.log('data',data)
        // console.log('fullAddress',fullAddress)
        // console.log('data.zonecode', data.zonecode)

        //상위 컴포넌트로 정보 전달
        props.handler({fullAddress: fullAddress, zonecode: data.zonecode})
        
    }
    //api 테마설정
    const themeObj = {
        bgColor: "#EDEDED", //바탕 배경색
        //searchBgColor: "", //검색창 배경색
        //contentBgColor: "", //본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
        pageBgColor: "#E0DFDF", //페이지 배경색
        //textColor: "", //기본 글자색
        //queryTextColor: "", //검색창 글자색
        postcodeTextColor: "#E9051E", //우편번호 글자색
        //emphTextColor: "", //강조 글자색
        outlineColor: "#727171" //테두리
    };

    //width랑 height를 따로 지정해놓는 이유 : 주소찾기 api를 화면 딱 중앙에 띄우고 싶어서
    let width = 500;
    let height = 600;
    const postCodeStyle = {
        display: "block",
        position: "absolute",
        width: width,
        height: height,
        padding: "7px",
        left: (window.screen.width / 2) - (width / 2),
        top: (window.screen.height / 2) - (height / 2)
    };

    return(
        <div>
            <DaumPostcode
                style={postCodeStyle}
                theme={themeObj}
                onComplete={handlePostCode}
                autoClose
            />
        </div>
    );
}

export default DaumPostcodeAPI;