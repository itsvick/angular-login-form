import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CscService } from '../csc.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  countries$: Observable<any> | null = null;
  states$: Observable<any> | null = null
  cities$: Observable<any> | null = null;
  constructor(private cscService: CscService) { }

  ngOnInit(): void {
    this.cscService.getAccessToken();
    this.cscService.init();
    this.countries$ = this.cscService.countries$;
  }

  login() {
    console.log(this.username);
    console.log(this.password);
  }

  onCountrySelect(event) {
    console.log("event", event);
    this.states$ = this.cscService.getStates(event.target.value);
  }

  onStateSelect(event) {
    this.cities$ = this.cscService.getCities(event.target.value);
  }
}
