import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStore } from "redux";
import rootReducer from "./reducers/reducer";

// https://velog.io/@760kry/React-Redux

const persistConfig = {
    key: 'root',
    storage
};

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default createStore(enhancedReducer);