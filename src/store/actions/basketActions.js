//https://velog.io/@djaxornwkd12/%EB%A6%AC%EB%8D%95%EC%8A%A4-%EC%A0%81%EC%9A%A9%ED%95%B4%EC%84%9C-%EC%9E%A5%EB%B0%94%EA%B5%AC%EB%8B%88-%EA%B8%B0%EB%8A%A5-%EB%A7%8C%EB%93%A4%EA%B8%B0

export const ADD_ITEM = "ADD_ITEM";
export const MODIFY_ITEM = "MODIFY_ITEM";
export const DELETE_ALL_ITEM = "DELETE_ITEM";
export const DELETE_THIS_ITEM = "DELETE_THIS_ITEM";
export const BUY_ITEMS = "BUY_ITEMS";

export const addBasket = (product) => {
    return {
        type: ADD_ITEM,
        payload: product,
    };
};

export const changeQuantity = (pcode, quantity) => {
    return{
        type: MODIFY_ITEM,
        payload: {pcode, quantity}
    }
}

export const deleteAll = () => {
    return {
        type: DELETE_ALL_ITEM,
        payload: [],
    };
};

export const deleteThis = (pcode) => {
    return {
        type: DELETE_THIS_ITEM,
        payload: {pcode},
    };
};

export const buyProduct = ([product])=>{
    return {
        type: BUY_ITEMS,
        payload: product
    }
}