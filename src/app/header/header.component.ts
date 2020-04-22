import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthAction from '../auth/store/auth.actions';
import * as RecipeAction from '../recipes/store/recipe.action';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    collapsed=true;
    // @Output() featureSelected = new EventEmitter<string>();

    // onSelect(feature: string){
    //     this.featureSelected.emit(feature);
    // }

    private userSub: Subscription;
    isAuthenticated = false;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>){}
    onSaveData(){
        // this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipeAction.StoreRecipes());
    }

    ngOnInit(){
        this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
            this.isAuthenticated = !!user;
        })
        // this.userSub = this.authService.user.subscribe( user => {
        //     this.isAuthenticated = !!user;
        // });
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
    }

    onLogout(){
        // this.authService.logout();
        this.store.dispatch(new AuthAction.Logout());
    }

    onFetchData(){
        // this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipeAction.FetchRecipes());
    }
}