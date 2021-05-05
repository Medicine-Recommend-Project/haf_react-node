import {ADD_ITEM, MODIFY_ITEM, DELETE_ALL_ITEM, DELETE_THIS_ITEM, BUY_ITEMS, DELETE_IT} from "../actions/basketActions";

const basketReducer = (state = INITIAL_STATE , action) => {
    if(action.payload === undefined) return state;  // 젤 첨 로딩 시 이것도 갱신되는게 꼴뵈기 싫어서 추가쓰
    // console.log('\n ● action type : ', action.type,'\n ● action.payload : ', action.payload);

    let newState = Object.assign({}, state);
    switch (action.type) {
        case ADD_ITEM:  // 장바구니 상품 추가
            for(let j=0; j < newState.basket.length; j++){  // 이미 장바구니에 담겨있는 상품을 추가하면 수량만 변경
                if(newState.basket[j].pcode === action.payload.pcode){
                    newState.basket[j].quantity += action.payload.quantity;
                    console.log(action.payload.pcode, ' 상품 추가 : ', newState.basket[j].quantity)
                    return newState;
                }
            }
            newState = {
                basket: newState.basket.concat(action.payload),
                count : newState.count += 1
            }
            break;
        // 장바구니 상품 수정
        case MODIFY_ITEM:
            newState.basket.forEach(pd => {
                if(pd.pcode === action.payload.pcode){
                    pd.quantity = action.payload.quantity
                    console.log(pd.pcode, '수량 수정 :', pd.quantity);
                }
            });
            break;
        // 장바구니 상품 개별 삭제
        case DELETE_IT:
            newState = {
                basket: newState.basket.filter(product => product.pcode !== action.payload),
                count : newState.count -= 1
            }
            break;
        // 장바구니 상품 선택 삭제
        case DELETE_THIS_ITEM:
            newState = {
                basket: newState.basket.filter(basket => !action.payload.includes(basket.pcode) ),
                count : newState.count -= action.payload.length
            }
            break;

        // 장바구니 상품 전체 삭제
        case DELETE_ALL_ITEM:
            newState = {
                basket: action.payload,
                count : newState.count = 0
            }
            break;
        // 상품 구매
        case BUY_ITEMS:
            let pcodes = action.payload.reduce((pcodes, payload)=>{ pcodes.push(payload.pcode); return pcodes;},[])
            let bk = newState.basket.filter(list => !pcodes.includes(list.pcode));  //pcodes 배열에 list.pcode가 포함되지 않은 것만 배열로 반환
            newState = {
                basket: bk,
                count : newState.count -= action.payload.length
            }
            break;
        default:
            return state;  // 두 타입이 아닐 경우 (에러 방지를 위해) state을 반환하는 것으로 설정해준다.
    }//end of switch
    console.log('\n ● basket : ', newState.basket , ' \n ● count : ', newState.count);

    return newState;
};

const INITIAL_STATE = {
    basket : [],    // { pcode: "", pname: "", quantity: "", price: "", cid: "cid는 예정..."}
    count : 0
}

export default basketReducer;