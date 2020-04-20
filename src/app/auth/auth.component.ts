import { Component, ComponentFactoryResolver, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponse } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthAction from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit,OnDestroy {

    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
    private closeSub: Subscription;
    private storeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactory: ComponentFactoryResolver, private store: Store<fromApp.AppState>){}

    isLoginMode = true;
    isLoading = false;
    error: string = null;

    ngOnInit(){
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error){
                this.showError(this.error);
            }
        })
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onHandleError(){
        // this.error = null;
        this.store.dispatch(new AuthAction.ClearError());
    }

    onSubmit(form: NgForm){
        if(form.invalid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponse>

        this.isLoading = true;
        if(this.isLoginMode){
            // authObs = this.authService.login(email, password);
            this.store.dispatch(new AuthAction.LoginStart({email: email, password: password}));
        } else {
            // authObs = this.authService.signup(email, password);
            this.store.dispatch(new AuthAction.SignupStart({email: email, password: password}))
        }

        // authObs.subscribe(responseData => {
        //     console.log(responseData);
        //     this.isLoading = false;
        //     this.router.navigate(['/recipes']);
        // }, errorMessage => {
        //     console.log(errorMessage);
        //     this.error = errorMessage;
        //     this.showError(errorMessage);
        //     this.isLoading = false;
        // });

        form.reset();
    }

    private showError(message: string){
        const alertCmpFactory = this.componentFactory.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();
        const compRef= hostViewContainerRef.createComponent(alertCmpFactory);

        compRef.instance.message = this.error;
        this.closeSub = compRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(){
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
        this.storeSub.unsubscribe();
    }
}