import { Component, OnInit } from '@angular/core';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { CrudService } from '../service/crud.service';
import { Planning } from '../Entites/Planning.Entites';
import { forkJoin } from 'rxjs';
import { ReservationFM } from '../Entites/ReservationFM.Entites';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-servicenettoyage',
  templateUrl: './servicenettoyage.component.html',
  styleUrls: ['./servicenettoyage.component.css']
})
export class ServicenettoyageComponent implements OnInit {
  messageCommande = "";
  reservationFM: ReservationFM = new ReservationFM(); // Initialisez la réservation
  listeplanning: Planning[] = [];
  listeutilisateur: Utilisateur[] = [];
  user: Utilisateur[] = [];
  selectedUtilisateur: Utilisateur | null = null;
  selectedPlanning: Planning | null = null; // Nouvelle propriété pour le planning sélectionné
  searchQuery: string = '';
  activefemme: string = '';
  paymentHandler: any = null;
  listReservation: import("c:/P1_frontend/frontend/src/app/Entites/ReservationFDM.Entites").ReservationFDM[][];
  listConfirmation: boolean[];

  constructor(private crudService: CrudService, private route: Router, private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.crudService.getPlanning().subscribe((planning: Planning[]) => {
      this.listeplanning = planning;
      const observables = this.listeplanning.map(i => this.crudService.getUtilisateurByPlanning(i.id));
      forkJoin(observables).subscribe(results => {
        this.listeutilisateur = results;
        this.invokeStripe();
      });
    });

    this.getUtilisateursParRole('Femme de menage');
  }

  getUtilisateursParRole(role: string): void {
    this.crudService.getUtilisateursParRole(role).subscribe(user => this.user = user);
  }

  selectfemme(utilisateur: Utilisateur, planningId?: number): void {
    this.selectedUtilisateur = utilisateur;
    if (planningId) {
      this.crudService.getPlanningById(planningId).subscribe(planning => {
        this.selectedPlanning = planning;
      });
    }
  }

  selectPlanning(planning: Planning): void {
    this.selectedPlanning = planning; // Mettre à jour selectedPlanning lors de la sélection d'un planning
  }

  setActiveplanning(gouvernorat: string): void {
    this.activefemme = gouvernorat;
  }

  searchPlanning(): void {
    if (this.searchQuery.trim() !== '') {
      this.listeplanning = this.listeplanning.filter(planning =>
        planning.gouvernorat.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.getPlanning();
    }
  }
  isPastDate(date: string): boolean {
    const planningDate = new Date(date);
    const currentDate = new Date();
    return planningDate >= currentDate;
  }
  
  searchUtilisateurParNom(): void {
    if (this.searchQuery.trim() !== '') {
      // Filtre la liste des utilisateurs en fonction du nom saisi
      this.user = this.user.filter(utilisateur =>
        (utilisateur.nom + ' ' + utilisateur.prenom).toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      // Si la recherche est vide, recharge tous les utilisateurs
      this.getUtilisateursParRole('Femme de menage');
    }
  }

  private getPlanning(): void {
    this.crudService.getPlanning().subscribe(plannings => {
      this.listeplanning = plannings;
  
      this.listConfirmation = []; // Réinitialiser la liste des confirmations
  
      // Parcourir chaque planning
      this.listeplanning.forEach(planning => {
        this.crudService.listeReservationFMByPlanning(planning.id).subscribe(reservations => {
          // Vérifier si au moins une réservation est confirmée dans ce planning
          const planningConfirmation = reservations.some(reservation => reservation.confirmation);
          
          // Ajouter le résultat à la liste des confirmations
          this.listConfirmation.push(planningConfirmation);
        });
      });
    });
    console.log("this.listConfirmation",this.listConfirmation)
  }
  

  get filteredPlanning(): Planning[] {
    let filtered = this.listeplanning;

    if (this.activefemme) {
      filtered = filtered.filter(planning => planning.gouvernorat === this.activefemme);
    }

    return filtered;
  }

  reserver(rq: ReservationFM) {
    this.messageCommande = `<div class="alert alert-primary" role="alert">Veuillez patienter ...</div>`;
    let datas = this.crudService.getUserInfo(); // Utilisation de crudService au lieu de service

    rq.id_client = datas?.id;
    
    console.log("hathy reservation ",rq)

    this.crudService.reserverFromApii(rq).subscribe((data: any) => {
      this.route.navigate(['mes_reservation']);
      this.messageCommande = `<div class="alert alert-success" role="alert">Réservé avec succès</div>`;
    }, err => {
      this.messageCommande = `<div class="alert alert-warning" role="alert">Erreur, Veuillez réessayer !!</div>`;
    });

    setTimeout(() => {
      this.messageCommande = "";
    }, 3000);
  }

  makePayment(amount: any) {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51PFI24F29zVOYaoLNwA55lQnMETgMsgILXooIySTysEtaUYck09EzbfHklFnfQQm2zmmtZam1Ss796gimwKUNUv4006HgVUZXa',
      locale: 'auto',
      token: (stripeToken: any) => { // Utilisation d'une fonction fléchée pour conserver le contexte de 'this'
        console.log(stripeToken);
        alert('Paiement effectué avec succès!');
        this.createReservation();
      },
    });
    paymentHandler.open({
      name: 'Réservation de Femme de ménage',
      description: 'Paiement pour la réservation',
      amount: amount * 100,
      currency: 'TND',
    });
  }

  createReservation() {
    const reservation = new ReservationFM();
    reservation.id_planification = this.selectedPlanning?.id;
    reservation.montant_paye = this.selectedPlanning?.prixParHeure; // Exemple d'attribution du montant
   
    

    this.reserver(reservation);
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51PFI24F29zVOYaoLNwA55lQnMETgMsgILXooIySTysEtaUYck09EzbfHklFnfQQm2zmmtZam1Ss796gimwKUNUv4006HgVUZXa',
          locale: 'auto',
          token: (stripeToken: any) => {
            console.log(stripeToken);
            alert('Paiement effectué avec succès!');
            this.createReservation();
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
