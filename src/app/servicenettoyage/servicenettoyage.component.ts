import { Component, Input, OnInit } from '@angular/core';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { CrudService } from '../service/crud.service';
import { Planning } from '../Entites/Planning.Entites';
import { forkJoin } from 'rxjs';
import { ReservationFM } from '../Entites/ReservationFM.Entites';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationFDM } from '../Entites/ReservationFDM.Entites';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { EvaluationFDM } from '../Entites/EvaluationFDM.Entites';
import { NgToastService } from 'ng-angular-popup';


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
  searchCityQuery: string = '';
  activefemme: string = '';
  IsloggedIn: boolean;
  paymentHandler: any = null;
  listReservation:ReservationFDM[];
  listConfirmation: boolean[];
  nbAvis: number;
  listEvaluation: EvaluationFDM[]=[];
  listClientAvis: Utilisateur[]=[];
  moyenneEtoiles: number;
  k: number=0;

  constructor(private crudService: CrudService, private route: Router, private router: ActivatedRoute,private toast:NgToastService,) { }


  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  faStar = faStar;

  setRating(rating: number) {
    if (!this.readonly) {
      this.rating = rating;
    }
  }

  ngOnInit(): void {
    this.IsloggedIn = this.crudService.isLoggedIn(); // Utilisez crudService au lieu de service

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
  addNewAvis() {
    if (!this.IsloggedIn) {
      this.toast.info({
        detail: 'Message d\'erreur',
        summary: 'Authentifiez-vous avant.',
      });
      this.connexion();
    } else {
      if (this.rating !== 0) {
        const datas = this.crudService.getUserInfo();
  
        if (!datas || !datas.id || !this.selectedUtilisateur || !this.selectedUtilisateur.id) {
          this.toast.error({
            detail: 'Message d\'erreur',
            summary: 'Données utilisateur ou utilisateur sélectionné non valides.',
          });
          return;
        }
  
        const avis = new EvaluationFDM(undefined, this.rating, undefined, datas.id, this.selectedUtilisateur.id);
        console.log("hathy avis ", avis);
        this.crudService.addEvaluationFDM(avis).subscribe(
          res => {
            console.log("reseltut hathy ", res);
            this.listEvaluation.push(res); // Supposons que response contient l'avis ajouté avec un identifiant généré par le serveur

            // Réinitialisez le formulaire si nécessaire
            this.nbAvis = this.listEvaluation.length;
            this.calculerMoyenneEtoiles(this.listEvaluation);


            // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
            const observables = this.listEvaluation.map(i => this.crudService.getUtilisateurByEvaluationFDM(i.id));
            forkJoin(observables).subscribe(results => {
              this.listClientAvis = results;
              console.log("hatha this.listClientAvis", this.listClientAvis);
            });

            // Calculer la nouvelle moyenne des étoiles
            

            this.toast.success({
              detail: 'Succès Message',
              summary: 'L\'avis est ajouté avec succès',
            });

            //window.location.reload();
          },
          err => {
            this.toast.error({
              detail: 'Message d\'erreur',
              summary: 'Problème de serveur',
            });
          }
        );
      } else {
        this.toast.info({
          detail: 'Message d\'erreur',
          summary: 'Veuillez remplir tous les champs obligatoires.',
        });
      }
    }
  }

  // Ajoutez cette méthode pour calculer la moyenne des étoiles
  calculerMoyenneEtoiles(listEvaluationN:EvaluationFDM[]) {
    
      this.moyenneEtoiles = 0;
    
      const totalEtoiles = listEvaluationN.reduce((sum, evaluation) => sum + evaluation.star, 0);
      this.moyenneEtoiles = totalEtoiles / this.listEvaluation.length;
    
    console.log("Nouvelle moyenne des étoiles : ", this.moyenneEtoiles);
  }
  
  

  connexion()
    {
      this.route.navigate(['/login'])
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
    this.crudService.listEvaluationByfdm(this.selectedUtilisateur.id).subscribe(evaluation => {
      this.nbAvis=evaluation.length;

      this.listEvaluation = evaluation;

      // Créer un tableau d'observables pour récupérer les utilisateurs associés aux avis
      const observables = this.listEvaluation.map(i => this.crudService.getUtilisateurByEvaluationFDM(i.id));
      this.calculerMoyenneEtoiles(this.listEvaluation);
      // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
      forkJoin(observables).subscribe(results => {
          this.listClientAvis = results;
      });
  });
  }

  selectPlanning(planning: Planning): void {
    this.selectedPlanning = planning; // Mettre à jour selectedPlanning lors de la sélection d'un planning
  }

  setActiveplanning(gouvernorat: string): void {
    this.activefemme = gouvernorat;
  }
  
  searchPlanningPargouvernorat(): void {
    if (this.searchCityQuery.trim() !== '') {
      this.listeplanning = this.listeplanning.filter(planning =>
        planning.gouvernorat.toLowerCase().includes(this.searchCityQuery.toLowerCase())
      );
    } else {
      this.getPlanning(); // Chargez les données initiales sans argument
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
    if (!this.IsloggedIn) {
      this.messageCommande = `<div class="alert alert-warning" role="alert">Vous devez être connecté pour réserver.</div>`;
      return;
    }
  
    this.messageCommande = `<div class="alert alert-primary" role="alert">Veuillez patienter ...</div>`;
    let datas = this.crudService.getUserInfo(); // Utilisation de crudService au lieu de service
  
    rq.id_client = datas?.id;
  
    console.log("hathy reservation ", rq);
  
    this.crudService.reserverFromApii(rq).subscribe((data: any) => {
      this.route.navigate(['mes_reservation']).then(()=>{window.location.reload()})
      this.messageCommande = `<div class="alert alert-success" role="alert">Réservé avec succès</div>`;
    }, err => {
      this.messageCommande = `<div class="alert alert-warning" role="alert">Erreur, Veuillez réessayer !!</div>`;
    });
  
    setTimeout(() => {
      this.messageCommande = "";
    }, 3000);
  }
  makePayment(amount: any) {
    if (!this.IsloggedIn) {
      this.messageCommande = `<div class="alert alert-warning" role="alert">Vous devez être connecté pour effectuer un paiement.</div>`;
      return;
    }

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
    reservation.montant_paye = this.selectedPlanning?.prixParHeure;
    
    this.reserver(reservation); // Exemple d'attribution du montant
   
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