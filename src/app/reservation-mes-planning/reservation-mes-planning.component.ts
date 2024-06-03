import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudService } from '../service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Planning } from '../Entites/Planning.Entites';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { ReservationRQFDM } from '../Entites/ReservationRQFDM.Entites';
import { forkJoin } from 'rxjs';
import { ReservationFDM } from '../Entites/ReservationFDM.Entites';

@Component({
  selector: 'app-reservation-mes-planning',
  templateUrl: './reservation-mes-planning.component.html',
  styleUrls: ['./reservation-mes-planning.component.css']
})
export class ReservationMesPlanningComponent {
  messageCommande = "";
  listPlanning: Planning[];
  p: number = 1;
  collection: any[];
  annonceForm: FormGroup; 
  listeReservateur: Utilisateur[];
  listReservation: ReservationRQFDM[];
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private service: CrudService,
    private route: Router,
    private router: ActivatedRoute,
    private toast: NgToastService,
  ) {}
  
  ngOnInit(): void {
    console.log("hatha liste reservation :", this.listReservation);
    console.log("hatha list annonce:", this.listPlanning);
    console.log("hatha list reservateur:", this.listeReservateur);
    this.userDetails = this.service.getUserInfo();

    // Récupérer les reservations
    this.service.listeReservationByFdm(this.userDetails.id).subscribe(reservation => {
        this.listReservation = reservation;

        // Créer un tableau d'observables pour récupérer les utilisateurs associés aux annonces
        const observables = this.listReservation.map(i => this.service.ClientByReservationFM(i.id));
        const observable = this.listReservation.map(i => this.service.planificationByReservation(i.id));
        // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
        forkJoin(observable).subscribe(results => {
            this.listPlanning = results;
            console.log("hatha this.listPlanning après ajout:", this.listPlanning);
        });
        forkJoin(observables).subscribe(results => {
          this.listeReservateur = results;
          console.log("hatha this.listeReservateur après ajout:", this.listeReservateur);
      });
    });

    console.log("hatha listReservation après chargement:", this.listReservation);
  }
  
  
  ConfirmerReservation(reservation:ReservationRQFDM)
  {
    console.log(reservation);
    let index=this.listReservation.indexOf(reservation);
    
      { if(confirm("Voulez vous accepter cette réservation avec référence  " + this.listPlanning[index].id+ " ?")) 
        {let newreservation =new ReservationFDM(reservation.id,
          reservation.date,reservation.montant_paye,true,true
        )
  
      this.service.updateReservationFM(reservation.id,newreservation).subscribe
  (
    res=>{console.log(res)
    this.listReservation[index]=newreservation
    this.route.navigate(['/reserver_mes_planning']).then(() => {
      window.location.reload();
    });
    },
    err=>console.log(err)
  )}

   
  }}
  NonConfirmerReservation(reservation:ReservationRQFDM)
  {
    console.log(reservation);
    let index=this.listReservation.indexOf(reservation);
    
      { if(confirm("Voulez vous réfuser cette réservation avec référence " + this.listPlanning[index].id + " ?")) 
        {let newreservation =new ReservationFDM(reservation.id,
          reservation.date,reservation.montant_paye,true,false
        )
  
      this.service.updateReservationFM(reservation.id,newreservation).subscribe
  (
    res=>{console.log(res)
    this.listReservation[index]=newreservation
    this.route.navigate(['/reserver_mes_planning']).then(() => {
      window.location.reload();
    });
    },
    err=>console.log(err)
  )}

   
  }}
  
  

  onSubmit(): void {
    console.log(this.annonceForm.value);
  }

}
