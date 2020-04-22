import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthAction from './auth.actions';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user.mode';
import { AuthService } from '../auth.service';

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
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthAction.Login({ email: email, userId: userId, token: token, expirationDate: expirationDate, redirect: true});
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
                }).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
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
            return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                })
                .pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                    }),
                    map(resData => {
                    return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                }))
                catchError(errorRes => {
                    return handleError(errorRes);
                });
        }),

    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(ofType(AuthAction.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthAction.Login) => {
            if(authSuccessAction.payload.redirect){
                this.router.navigate(['/']);
            }
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(ofType(AuthAction.LOGOUT), tap(() => {
        this.authService.clearLogoutTimer();
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
    }));

    @Effect()
    autoLogin = this.actions$.pipe(ofType(AuthAction.AUTO_LOGIN), 
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type: 'DUMMY' };
            }
    
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    
            if(loadedUser.token){
                const expiryDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expiryDuration);
                return new AuthAction.Login({email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData._tokenExpirationDate), redirect: false})
                // const expiryDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                // this.autoLogout(expiryDuration);
            }
            return { type: 'DUMMY'}
        })
    );

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) { }
}