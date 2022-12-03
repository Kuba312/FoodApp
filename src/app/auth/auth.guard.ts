import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { map, take, Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  // auth guard is responsible for creating guardian for links. This is used for security purposes.
  // we can define custom logic where we can tell angular in which conditions users are allowed to access the
  // under specifc links.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(take(1), map(user => {
      const isAuth = !!user
      if (isAuth) {
        return true;
      }
      return this.router.createUrlTree(['/auth']);
    }))
  }


}
