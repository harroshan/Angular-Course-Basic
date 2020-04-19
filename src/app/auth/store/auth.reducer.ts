import { User } from '../user.mode';
import * as AuthAction from './auth.actions';

export interface State{
    user: User;
}

const initialState = {
    user: null
}

export function AuthReducer(state = initialState, action: AuthAction.AuthAction){
    switch(action.type){
        case AuthAction.LOGIN:
            const user = new User(action.payload.email, action.payload.userId, action.payload.token, action.payload.expirationDate);
            return {
                ...state,
                user: user
            };
        case AuthAction.LOGOUT:
            return {
                ...state,
                user: null
            } 
    }

    return state;
}