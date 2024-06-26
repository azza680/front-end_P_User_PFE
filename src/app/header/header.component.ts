import { Component } from '@angular/core';
import { CrudService } from '../service/crud.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../Entites/Utilisateur.Entites';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  IsloggedIn:boolean
  IsUtilisateurIn:boolean
  isProprietaire:boolean
  userDetails: any;

 
  constructor(private service:CrudService,private router:Router) { }

  ngOnInit(): void {
    this.userDetails = this.service.getUserDetails();
    this.IsloggedIn=this.service.isLoggedIn();
    this.IsUtilisateurIn=this.service.isUtilisateurInIn();
    this.isProprietaire=this.service.isProprietaire();
    console.log("photo hathy "+this.userDetails.photo)
    
  
  }
 

  logout(){
    console.log("logout");
    localStorage.clear()
    this.router.navigate(['/']).then(() => {
      window.location.reload()
    })
    
  }

}
