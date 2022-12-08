import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, EMPTY, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CscService {

  private _countries$ = new BehaviorSubject<any>([]);
  public countries$ = this._countries$.asObservable();

  constructor(private http: HttpClient) { }

  getAccessToken() {
    const option = {
      headers: {
        'api-token': environment.cscAuthToken,
        "user-email": environment.cscEmail
      }
    }
    this.http.get(`${environment.cscAPIUrl}/api/getaccesstoken`, option)
      .subscribe((data: { auth_token: string }) => {
        console.log("data", data);
        localStorage.setItem('cscAccessToken', data.auth_token);
      }, (error) => {
        console.log('error', error);
      });
  }

  init() {
    this.http.get(`${environment.cscAPIUrl}/api/countries`, this.getRequestOption())
      .pipe(
        map((data: any) => {
          const countries = data.map((data: any) => {
            return {
              name: data.country_name,
              shortName: data.country_short_name,
              code: data.country_phone_code
            }
          });
          this._countries$.next(countries);
          return countries;
        }),
        catchError((error) => {
          if (error.name === 'TokenExpiredError') {
            return this.handleTokenExpiredError(error);
          }
          throwError(error);
        })).subscribe();
  }

  getStates(countryId: string) {
    return this.http.get(`${environment.cscAPIUrl}/api/states/${countryId}`, this.getRequestOption())
      .pipe(
        map((data: any) => {
          return data.map((data: any) => { return { name: data.state_name } })
        }),
        catchError((error) => {
          if (error.name === 'TokenExpiredError') {
            return this.handleTokenExpiredError(error);
          }
          throwError(error);
        }));
  }

  getCities(stateId: string) {
    return this.http.get(`${environment.cscAPIUrl}/api/cities/${stateId}`, this.getRequestOption())
      .pipe(
        map((data: any) => {
          return data.map((data: any) => { return { name: data.city_name } })
        }),
        catchError((error) => {
          if (error.name === 'TokenExpiredError') {
            return this.handleTokenExpiredError(error);
          }
          throwError(error);
        }));
  }

  getRequestOption() {
    const option = {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem('cscAccessToken'),
      }
    }
    return option;
  }

  handleTokenExpiredError(error) {
    localStorage.removeItem('cscAccessToken');
    this.getAccessToken();
    return EMPTY
  }
}
