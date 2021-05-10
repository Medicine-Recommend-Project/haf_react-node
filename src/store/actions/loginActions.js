export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const doLogin = () => {
    return {
        type: LOGIN,
        payload: true
    };
};

export const doLogout = () => {
    return{
        type: LOGOUT,
        payload: false
    }
}