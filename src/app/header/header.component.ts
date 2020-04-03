import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy{
    // collapsed=true;
    // @Output() featureSelected = new EventEmitter<string>();

    // onSelect(feature: string){
    //     this.featureSelected.emit(feature);
    // }

    private userSub: Subscription;
    isAuthenticated = false;

    constructor(private dataStorageService: DataStorageService, private authService: AuthService){}
    onSaveData(){
        this.dataStorageService.storeRecipes();
    }

    ngOnInit(){
        this.userSub = this.authService.user.subscribe( user => {
            this.isAuthenticated = !!user;
        });
    }

    ngOnDestroy(){
        this.userSub.unsubscribe();
    }

    onLogout(){
        this.authService.logout();
    }

    onFetchData(){
        this.dataStorageService.fetchRecipes().subscribe();
    }
}