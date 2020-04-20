import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import * as fromApp from './store/app.reducer';
import { Store } from '@ngrx/store';
import * as AuthAction from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // loadedFeature: string='recipe';

  // onNavigate(feature: string){
  //   this.loadedFeature=feature;
  // }

  constructor(private authService: AuthService, private loggingService: LoggingService, private store: Store<fromApp.AppState>){}

  ngOnInit(){
    //  this.authService.autoLogin();
    this.store.dispatch(new AuthAction.AutoLogin());
     this.loggingService.printLog("Calling from AppComponent");
  }
}
