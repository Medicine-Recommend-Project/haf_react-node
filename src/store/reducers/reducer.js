import { combineReducers } from "redux";
import basketReducer from "./basketReducer";
import loginReducer from "./loginReducer";

export default combineReducers({
    basketReducer, loginReducer  // basketReducer : basketReducer 의 단축속성이다.
})

/**
 * 하나 이상의 리듀서를 합쳐줘야 할 때는 아래와 같이 써주면 된다

    export default combineReducers({
        cartReducer, asdadReducer
    })
 */