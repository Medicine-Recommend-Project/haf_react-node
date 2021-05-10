import {LOGIN, LOGOUT} from "../actions/loginActions";

const loginReducer = (state = INITIAL_STATE , action) => {
    if(action.payload === undefined) return state;  // 젤 첨 로딩 시 이것도 갱신되는게 꼴뵈기 싫어서 추가쓰
    // console.log('\n ● action type : ', action.type,'\n ● action.payload : ', action.payload);

    let newState = Object.assign({}, state);
    switch (action.type) {
        case LOGIN:  // 로그임함
            newState = { login: action.payload }
            break;
        case LOGOUT:  // 로그아웃함
            newState = { login: action.payload }
            break;
        default:
            return state;  // 두 타입이 아닐 경우 (에러 방지를 위해) state을 반환하는 것으로 설정해준다.
    }//end of switch

    return newState;
};

const INITIAL_STATE = {
    login: false
}

export default loginReducer;