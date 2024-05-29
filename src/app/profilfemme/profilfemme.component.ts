import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../service/crud.service';
import{ NgToastService } from 'ng-angular-popup';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { Planning } from '../Entites/Planning.Entites';

@Component({
  selector: 'app-profilfemme',
  templateUrl: './profilfemme.component.html',
  styleUrls: ['./profilfemme.component.css']
})
export class ProfilfemmeComponent {
  userDetails: Utilisateur; // Type spécifique pour userDetails
  profil: Utilisateur[];
  p:number=1;
  collection:any[]
  utilisateur: any;
  PlanningForm: FormGroup;
  IsloggedIn: boolean;
  IsUtilisateurIn: boolean;
  isProprietaire: boolean;

  constructor(private service: CrudService, private router: Router, private formBuilder: FormBuilder, private toast: NgToastService) { 
    this.userDetails = this.service.getUserInfo();
    console.log(this.userDetails);
  }
  Deleteutilisateur(utilisateur: Utilisateur){
    if(confirm("Voulez vous supprimer votre compte ?")) {
     
      this.service.onDeleteUtilisateur(utilisateur.id).subscribe(() => {
        this.router.navigate(['/profilemme']).then(() => {
          window.location.reload()
          
        })
      })
   
    }
  }

  ngOnInit(): void {
    console.log(this.userDetails);
    this.IsloggedIn=this.service.isLoggedIn();
    this.IsUtilisateurIn=this.service.isUtilisateurInIn();
    this.isProprietaire=this.service.isProprietaire();
    this.service.getUtilisateur().subscribe(utilisateurs => {
      this.profil = utilisateurs.filter(user => user.id === this.userDetails.id);
    });
    this.PlanningForm = this.formBuilder.group({
      heureDisponible: ['', Validators.required], // Heure disponible
      jour: ['', Validators.required], // Jour
      adresse: ['', Validators.required], // Adresse
      prixParHeure: ['', Validators.required], // Prix par heure
      gouvernorat: ['', Validators.required],
    });
      
  }
  logout(): void {
    console.log("logout");
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  modifier_profil_femme(id: number): void {
    this.router.navigate(['/modifier_profil_femme', id]);
  }

   addNewPlanning() {
    if (this.PlanningForm.valid) {
      const data = this.PlanningForm.value;
      const planning = new Planning(undefined, data.heureDisponible, data.jour, data.adresse, data.prixParHeure,this.userDetails.id, data.gouvernorat);

      this.service.addPlanning(planning).subscribe(
        (res) => {
          this.toast.success({
            detail: 'Succes Message',
            summary: 'Le planning est ajouté avec succès',
          });
          
          this.router.navigate(['/listeplanning']);
          
        },
        (err) => {
          console.log(err);
          this.toast.error({
            detail: 'Error Message',
            summary: 'Problème de Serveur',
          });
        }
      );
    } else {
      this.toast.info({
        detail: 'Error Message',
        summary: 'Veuillez remplir tous les champs obligatoires.',
      });
    }
  }
}