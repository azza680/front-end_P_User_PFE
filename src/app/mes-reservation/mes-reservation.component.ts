import { Component } from '@angular/core';
import { ReservationRq } from '../Entites/ReservationRq.Entites';
import { Reservation } from '../Entites/Reservation.Entites';
import { forkJoin } from 'rxjs';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { Annonce } from '../Entites/Annonce.Entites';
import { FormBuilder } from '@angular/forms';
import { CrudService } from '../service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ReservationRQFDM } from '../Entites/ReservationRQFDM.Entites';
import { Planning } from '../Entites/Planning.Entites';

@Component({
  selector: 'app-mes-reservation',
  templateUrl: './mes-reservation.component.html',
  styleUrls: ['./mes-reservation.component.css']
})
export class MesReservationComponent 
{
  messageCommande = "";
  annonce: Annonce;
  listAnnonce: Annonce[];
  p: number = 1;
  collection: any[];
  listReservation: ReservationRq[];
  userDetails: any;
  listReservationFDM: ReservationRQFDM[];
  listPlanification: Planning[];
  listFDM: Utilisateur[];

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
    console.log("hatha liste reservation fdm:", this.listReservationFDM);
    console.log("hatha list annonce:", this.listAnnonce);
    console.log("hatha list Planification:", this.listPlanification);

    this.userDetails = this.service.getUserInfo();

    // Récupérer les reservations
    this.service.listReservationByUtilisateur(this.userDetails.id).subscribe(reservation => {
        this.listReservation = reservation;

        // Créer un tableau d'observables pour récupérer les utilisateurs associés aux annonces
        const observableReservations = this.listReservation.map(i => this.service.AnnonceByReservation(i.id));
        // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
        forkJoin(observableReservations).subscribe(results => {
            this.listAnnonce = results;
            console.log("hatha list annonce après ajout:", this.listAnnonce);
        });
    });

    // Récupérer les reservations FDM
    this.service.listReservationFDMByUtilisateur(this.userDetails.id).subscribe(reservation => {
        this.listReservationFDM = reservation;

        // Créer un tableau d'observables pour récupérer les planifications associées aux réservations FDM
        const observablePlanifications = this.listReservationFDM.map(i => this.service.planificationByReservation(i.id));
        // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
        forkJoin(observablePlanifications).subscribe(results => {
            this.listPlanification = results;
            console.log("hatha list planification après ajout:", this.listPlanification);

            // Une fois que les planifications sont récupérées, récupérer les utilisateurs associés aux planifications
            const observablesFDM = this.listPlanification.map(i => this.service.getUtilisateurByPlanning(i.id));
            forkJoin(observablesFDM).subscribe(results => {
                this.listFDM = results;
                console.log("hatha list listFDM après ajout:", this.listFDM);
            });
        });
    });

    console.log("hatha list listAnnonce après chargement:", this.listAnnonce);
}

  
isRecentReservation(reservationDate: string): boolean {
  const now = new Date();
  const reservation = new Date(reservationDate);
  const diff = now.getTime() - reservation.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours <= 48;
}

  DeleteReservation(reservation: ReservationRq): void {
    if (confirm("Voulez-vous annuler cette réservation ?")) {
      this.service.onDeleteReservation(reservation.id).subscribe(() => {
        this.route.navigate(['/mes_reservation']).then(() => {
          window.location.reload();
        });
      });
    }
  }
  DeleteReservationfm(reservation: ReservationRQFDM): void {
    if (confirm("Voulez-vous annuler cette réservation ?")) {
      this.service.onDeleteReservationFDM(reservation.id).subscribe(() => {
        this.route.navigate(['/mes_reservation']).then(() => {
          window.location.reload();
        });
      });
    }
  }
  
  


}
