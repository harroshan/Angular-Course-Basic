import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponse{
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{

    constructor(private http: HttpClient){}

    signup(email: string, password: string){
        return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAkda08JukUjm6MULPrp_AnaAdLG1JwU4s",
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError));
    }

    login(email: string, password: string){
        return this.http.post<AuthResponse>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAkda08JukUjm6MULPrp_AnaAdLG1JwU4s",
        {
            email: email,
            password: password,
            returnSecureToken: true
        });
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'An Unknown error occured!';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        } else {
            switch(errorRes.error.error.message){
                case 'EMAIL_EXISTS': errorMessage = 'This email exists already';
            }
        }
        return throwError(errorMessage);
    }
}