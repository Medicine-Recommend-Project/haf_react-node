import React from "react";

function CommonPI({product}) {
    return(
        <div id="information">
                <h3>고시 정보</h3>
            <p>
                포함 성분 : 아주 좋은 영양 성분들 <br/>
                제조 국가 : {product.continents} <br/>
                등록 일 : {product.pdate} <br/>
            </p>
            <hr/>
                <h3>주의사항</h3>
            <p>
                사용 설명서를 잘 읽어보시고 복용하여주십시오. <br/>
                건강보조식품입니다. <br/>
                의사와 상담하고 드십시오. <br/>
                사람마다 효과가 상이할 수 있습니다. <br/>
            </p>
            <hr/>
                <h3>판매자 정보</h3>
            <p>
                상호명 : HAF Store <br/>
                대표자 : 김혜지<br/>
                사업자 등록번호 : 000-000-00000<br/>
                사업장 소재지 : 부산시 동래구 ...<br/>
            </p>
            <hr/>
                <h3>고객 센터</h3>
            <p>
                주중 : 09:00 ~ 17:00, <span>주말/공휴일 휴무</span><br/>
                이메일 : haf@mail.com<br/>
                전화번호 : 0000-00000<br/>
            </p>
        </div>
    )
}

export default CommonPI;