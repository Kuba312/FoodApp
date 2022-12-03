import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Subject, throwError, tap, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}


export interface AuthResponseDataLogin {

  localId: string,
  email: string,
  displayName: string,
  idToken: string,
  registered: boolean,
  refreshToken: string,
  expiresIn: string

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // due to BehaviorSubject we can easy pass state of user through many components
  user = new BehaviorSubject<User>(null);
  clearExpirationTimer: any;


  readonly API_KEY = 'AIzaSyDOp7j2Il_jXwNlSZLcPVUCJOlc9MmYUkk';

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>
      (
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.hadnleError),
        tap(resData => {
          this.handleAuthentication(resData);
        }));
  }




  login(email: string, password: string) {
    return this.http.post<AuthResponseDataLogin>
      (
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      ).pipe(
        catchError(this.hadnleError), tap(resData => {
          this.handleAuthentication(resData);
        }));
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.clearExpirationTimer) {
      clearTimeout(this.clearExpirationTimer);
    }
    this.clearExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.clearExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration)
  }

  // We are retriving our saved data in localStorage
  // and based on data from localStorage we create user
  // and then the user will be able to refresh page without login again
  // we check also if user contains token if yes, then we invoke autoLogout function
  // and pass time after which user should be logout. (time of token - current time)
  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.autoLogout(new Date(userData._tokenExpirationDate).getTime() - new Date().getTime());
      this.user.next(loadedUser);
    }
  }

  // Here we create a user to authenication. Due to this user object we can in easy way manage
  // our auth system -> means that we can tell Angular when that after some time we logout user (expirationDate) // we can logout user as well
  // after creating user with proper values, we pass him to BehaviorSubject
  // autoLogut function allows ut to automatically logut user after expiring token date
  private handleAuthentication(resData: AuthResponseData | AuthResponseDataLogin) {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    this.user.next(user);
    this.autoLogout(+resData.expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private hadnleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An error occured';
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Password is incorrect';
        break;
    }

    if (errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }


    return throwError(() => new Error(errorMessage));
  }
}

