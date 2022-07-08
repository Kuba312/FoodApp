import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, Observable, take } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {


  constructor(private authService: AuthService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // make sure that we get user once and we are done
    return this.authService.user.pipe(take(1),
      exhaustMap(user => {
        // if we haven't a user login, we should continue a http jurney
        if(!user){
          return next.handle(req);
        }
        // if we have a user, we add to param auth set with user token to be able to fetch data
        const modifiedRequest = req
          .clone({
            params: new HttpParams()
              .set('auth', user.token)
          })
        return next.handle(modifiedRequest);
      }))

  }

}
