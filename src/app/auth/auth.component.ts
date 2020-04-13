import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponse } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {

    @ViewChild(PlaceHolderDirective, {static: false}) alertHost: PlaceHolderDirective;
    private closeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactory: ComponentFactoryResolver){}

    isLoginMode = true;
    isLoading = false;
    error: string = null;

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onHandleError(){
        this.error = null;
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
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(responseData => {
            console.log(responseData);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.showError(errorMessage);
            this.isLoading = false;
        });

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
    }
}