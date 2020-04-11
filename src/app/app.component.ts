import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';

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

  constructor(private authService: AuthService, private loggingService: LoggingService){}

  ngOnInit(){
     this.authService.autoLogin();
     this.loggingService.printLog("Calling from AppComponent");
  }
}
