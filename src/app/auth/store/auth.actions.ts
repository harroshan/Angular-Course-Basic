import { Action } from '@ngrx/store';

export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Failure';
export const LOGIN_START = '[Auth] Login Start';
export const LOGOUT = '[Auth] Logout';
export const SIGNUP_START = '[Auth] SignUp Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class Login implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload : {
        email: string;
        userId: string;
        token: string;
        expirationDate: Date;
    }){}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}){}
}

export class LoginFail implements Action{
    readonly type = AUTHENTICATE_FAIL;

    constructor(public payload: string){}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: {email: string, password: string}){}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthAction = Login | Logout | LoginStart | LoginFail | SignupStart | ClearError | AutoLogin