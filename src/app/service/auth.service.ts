import { CrudService } from './crud.service';


import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private service: CrudService, private router: Router) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let isLoggedIn = this.service.isLoggedIn();
    let isFDM=this.service.isFDM();
    let IsUtilisateurIn=this.service.isUtilisateurInIn();
    let isProprietaire=this.service.isProprietaire();

    if (isLoggedIn && !isFDM) {
      return true;
    }else{
      this.router.navigate(['/page-erreur']);

      return false;
    }
    
  }

}
