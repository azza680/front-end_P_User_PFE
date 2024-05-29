import { Component } from '@angular/core';
import { Annonce } from '../Entites/Annonce.Entites';
import { CrudService } from '../service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationRq } from '../Entites/ReservationRq.Entites';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { NgToastService } from 'ng-angular-popup';
import { forkJoin } from 'rxjs';
import { Reservation } from '../Entites/Reservation.Entites';

@Component({
  selector: 'app-reservation-mes-annonces',
  templateUrl: './reservation-mes-annonces.component.html',
  styleUrls: ['./reservation-mes-annonces.component.css']
})
export class ReservationMesAnnoncesComponent 
{
  messageCommande = "";
  annonce: Annonce;
  listAnnonce: Annonce[];
  p: number = 1;
  collection: any[];
  annonceForm: FormGroup; 
  listeReservateur: Utilisateur[];
  listReservation: ReservationRq[];
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private service: CrudService,
    private route: Router,
    private router: ActivatedRoute,
    private toast: NgToastService,
  ) {}
  detailannonce(id: number): void {
    this.route.navigate(['/detailannonce', id]);
  }
  ngOnInit(): void {
    console.log("hatha liste reservation :", this.listReservation);
    console.log("hatha list annonce:", this.listAnnonce);
    console.log("hatha list reservateur:", this.listeReservateur);
    this.userDetails = this.service.getUserInfo();

    // Récupérer les reservations
    this.service.listReservationByAnnonceur(this.userDetails.id).subscribe(reservation => {
        this.listReservation = reservation;

        // Créer un tableau d'observables pour récupérer les utilisateurs associés aux annonces
        const observables = this.listReservation.map(i => this.service.ClientByReservation(i.id));
        const observable = this.listReservation.map(i => this.service.AnnonceByReservation(i.id));
        // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
        forkJoin(observable).subscribe(results => {
            this.listAnnonce = results;
            console.log("hatha list annonceur après ajout:", this.listAnnonce);
        });
        forkJoin(observables).subscribe(results => {
          this.listeReservateur = results;
          console.log("hatha list annonceur après ajout:", this.listeReservateur);
      });
    });

    console.log("hatha list annonce après chargement:", this.listAnnonce);
  }
  
  
  ConfirmerReservation(reservation:ReservationRq)
  {
    console.log(reservation);
    let index=this.listReservation.indexOf(reservation);
    
      { if(confirm("Voulez vous accepter cette réservation de l'annonce " + this.listAnnonce[index].titre + " ?")) 
        {let newreservation =new Reservation(reservation.id,reservation.date_arrivee,reservation.date_depart,reservation.nb_nuit,reservation.nb_vacancier,
          reservation.date,reservation.montant_paye,true,true
        )
  
      this.service.updateReservation(reservation.id,newreservation).subscribe
  (
    res=>{console.log(res)
    this.listReservation[index]=newreservation
    this.route.navigate(['/reservation_mes_annonces']).then(() => {
      window.location.reload();
    });
    },
    err=>console.log(err)
  )}

   
  }}
  NonConfirmerReservation(reservation:ReservationRq)
  {
    console.log(reservation);
    let index=this.listReservation.indexOf(reservation);
    
      { if(confirm("Voulez vous réfuser cette réservation de l'annonce " + this.listAnnonce[index].titre + " ?")) 
        {let newreservation =new Reservation(reservation.id,reservation.date_arrivee,reservation.date_depart,reservation.nb_nuit,reservation.nb_vacancier,
          reservation.date,reservation.montant_paye,true,false
        )
  
      this.service.updateReservation(reservation.id,newreservation).subscribe
  (
    res=>{console.log(res)
    this.listReservation[index]=newreservation
    this.route.navigate(['/reservation_mes_annonces']).then(() => {
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
