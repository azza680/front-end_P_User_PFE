import { Component, OnInit } from '@angular/core';
import { ReservationFM } from '../Entites/ReservationFM.Entites';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { CrudService } from '../service/crud.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-mes-planning',
  templateUrl: './reservation-mes-planning.component.html',
  styleUrls: ['./reservation-mes-planning.component.css']
})
export class ReservationMesPlanningComponent implements OnInit {
  userDetails: Utilisateur;
  reservationFm: ReservationFM[] = [];
  nbreservation = 0;
  id: number;

  constructor(
    private service: CrudService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userDetails = this.service.getUserDetails();

    if (this.userDetails) {
      this.service.listReservationFMByUtilisateur(this.userDetails.id).subscribe(reservations => {
        this.reservationFm = reservations;
        this.nbreservation = this.reservationFm.length;
        console.log("Liste des réservations :", this.reservationFm);
        console.log("Liste des utilisateur :", this.userDetails);
      });
    }
  }
}
