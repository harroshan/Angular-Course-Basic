import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthAction from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface AuthResponse {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (email: string, userId: string, token: string, expiresIn: number) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    return new AuthAction.Login({ email: email, userId: userId, token: token, expirationDate: expirationDate });
}

const handleError = (errorRes: any) => {
    let errorMessage = 'An Unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthAction.LoginFail(errorMessage));
    } else {
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = 'This email exists already'; break;
            case 'EMAIL_NOT_FOUND': errorMessage = 'This email doesn\'t exist'; break;
            case 'INVALID_PASSWORD': errorMessage = 'Wrong Password Input'; break;
        }
    }
    return of(new AuthAction.LoginFail(errorMessage));
}

@Injectable()
export class AuthEffects {

    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthAction.SIGNUP_START),
        switchMap((signupAction: AuthAction.SignupStart) => {
            return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }).pipe(map(resData => {
                    return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                })),
                catchError(errorRes => {
                    return handleError(errorRes);
                });
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthAction.LOGIN_START),
        switchMap((authData: AuthAction.LoginStart) => {
            return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                })
                .pipe(map(resData => {
                    return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                })),
                catchError(errorRes => {
                    return handleError(errorRes);
                });
        }),

    );

    @Effect({ dispatch: false })
    authSuccess = this.actions$.pipe(ofType(AuthAction.AUTHENTICATE_SUCCESS),
        tap(() => {
            this.router.navigate(['/']);
        })
    );

    constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}