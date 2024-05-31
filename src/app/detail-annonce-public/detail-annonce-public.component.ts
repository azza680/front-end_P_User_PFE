import { Component } from '@angular/core';
import { Annonce } from '../Entites/Annonce.Entites';
import { CrudService } from '../service/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { ReservationRq } from '../Entites/ReservationRq.Entites';
import { Evaluation } from '../Entites/Evaluation.Entites';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-detail-annonce-public',
  templateUrl: './detail-annonce-public.component.html',
  styleUrls: ['./detail-annonce-public.component.css']
})
export class DetailAnnoncePublicComponent {
  messageCommande="";
  annonce: Annonce;
  listAnnonce: Utilisateur[];
  annonceur:Utilisateur;
  p:number=1;
  nbannonce:number;
  id: number;
  collection:any[]
  enableForm: boolean = true;
  currentDateArrivee: string;
  currentDateDepart:String;
  numberOfNights: number;
  prix:number;
  checkoutParentGroup: FormGroup;
  prixsemaine: number;
  prixmois: number;
  reservation:ReservationRq;
  paymentHandler: any = null;
  IsloggedIn:boolean
  listEvaluation: Evaluation[]= [];prixTotale: number;
;
  listClientAvis: Utilisateur[];
  nbAvis: number;
  updateForm: FormGroup;
  AvisForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: CrudService,
    private route: Router,
    private router: ActivatedRoute,private toast:NgToastService,
    

  ) { 
    let formControls = {
      date_arrivee: new FormControl('',[
        Validators.required,
        
      ]),
      date_depart: new FormControl('',[
        Validators.required,
        
      ]),
      nb_vacancier: new FormControl('',[
        Validators.required,
        
      ])
    }
    
    this.AvisForm = this.fb.group({
      commentaire: ['', Validators.required]
    });
    this.checkoutParentGroup = this.fb.group(formControls)
    this.checkoutParentGroup.controls['date_arrivee'].valueChanges.subscribe((value) => {
      this.currentDateArrivee = value;
      this.calculateNumberOfNights();

    });
    this.checkoutParentGroup.controls['date_depart'].valueChanges.subscribe((value) => {
      this.currentDateDepart = value;
      this.calculateNumberOfNights();

    });
  }
  get date_arrivee() { return this.checkoutParentGroup.get('date_arrivee') }
   get date_depart() { return this.checkoutParentGroup.get('date_depart') }
   get nb_vacancier(){
    return this.checkoutParentGroup.get('nb_vacancier')
  }
  get commentaire() {
    return this.updateForm.get('commentaire');
  }
  done() {
    let data = this.checkoutParentGroup.value;
    
    if (
      !this.IsloggedIn
      
    )
    {
      this.toast.info({
        detail: 'Error Message',
        summary: 'Authentifiez-vous avant de réserver.',
      });
      this.connexion();
      
    } else
     { 
      if (data.date_arrivée == 0 ||
        data.date_depart==0 ||
        data.nb_vacancier ==0) 
        {
          this.toast.info({
            detail: 'Error Message',
            summary: 'Remplir votre champs',
          });
       }else {
        this.reservation = new ReservationRq();
        this.reservation.id_annonce = this.annonce.id;
        this.reservation.date_arrivee = data.date_arrivee;
        this.reservation.date_depart = data.date_depart;
        this.reservation.nb_nuit=this.numberOfNights;
        this.reservation.nb_vacancier = data.nb_vacancier;
        this.reservation.date;
        this.reservation.montant_paye=this.prixTotale;
        console.log("nchlh temchy : ", this.reservation);
        this.enableForm = false;
      }
      
    }
    }
   

    connexion()
    {
      this.route.navigate(['/login'])
    }
    calculateTotalPrice(price: number, numberOfNights: number) {
      this.prixsemaine = price * numberOfNights;
    }
    calculateNumberOfNights() {
      if (this.currentDateArrivee && this.currentDateDepart) {
        const arrivalDate = new Date(this.currentDateArrivee);
        const departureDate = new Date(this.currentDateDepart.toString());
        const differenceInTime = departureDate.getTime() - arrivalDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        this.numberOfNights = differenceInDays;
       
        const price = parseFloat(this.annonce.prix);
        console.log("prix hatha" ,price)
        this.prix =price*this.numberOfNights;
        this.prixsemaine=this.prix-(this.prix*7)/100;
        this.prixmois=this.prix-(this.prix*15)/100;
    console.log("prix totale  hatha" ,price * this.numberOfNights)
    if (this.numberOfNights>=7 && this.annonce.reduction_semaine){this.prixTotale=this.prixsemaine}
        else if (this.numberOfNights>=30 && this.annonce.reduction_mois){this.prixTotale=this.prixmois}
        else {this.prixTotale=this.prix}
        
      }
    }
    
    
  ngOnInit(): void {
    this.IsloggedIn=this.service.isLoggedIn();

    let idEvent = this.router.snapshot.params['id'];
    this.id = idEvent;
    console.log(this.id);
    console.log("hatha annonceur :",this.annonceur)
    
    console.log("hatha list annonce:",this.listAnnonce)
    
    this.service.getUtilisateurByAnnonce(this.id).subscribe(annonceur => {
      this.annonceur = annonceur;
      this.service.listeAnnonceByAnnonceur(annonceur.id).subscribe(listAnnonce => {
      
        this.nbannonce = listAnnonce.length;
        console.log("hatha list annonce:",this.listAnnonce)
      })
      console.log("hatha annonceur :",annonceur)
    })
    this.service.getAnnonceById(this.id).subscribe(annonce => {
      this.annonce = annonce
      console.log("hatha id annonce :",annonce.id)
      console.log("hatha annonceur :",this.annonceur)
      
    })
    this.invokeStripe();
    // Récupérer les evaluation
    this.service.listEvaluationByAnnonce(this.id).subscribe(evaluation => {
      this.nbAvis=evaluation.length;
      this.listEvaluation = evaluation;

      // Créer un tableau d'observables pour récupérer les utilisateurs associés aux avis
      const observables = this.listEvaluation.map(i => this.service.getClientByEvaluation(i.id));

      // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
      forkJoin(observables).subscribe(results => {
          this.listClientAvis = results;
          console.log("hatha list annonceur après ajout:", this.listClientAvis);
      });
  });

  console.log("hatha list annonce après chargement:", this.listAnnonce);
    

    
    
  
}
reserver(rq:ReservationRq)
  {
    this.messageCommande=`<div class="alert alert-primary" role="alert">
    Veuillez patienter ...
  </div>`
    console.log(event)
    let datas=this.service.getUserInfo()
    
    rq.id_client=datas?.id 
    
   
    console.log(rq,"what we senddddd")
    this.service.reserverFromApi(rq).subscribe((data:any)=>{
      this.route.navigate(['mes_reservation'])
    
      this.messageCommande=`<div class="alert alert-success" role="alert">
    Réservé avec succès
  </div>`
    }, err=>{
      this.messageCommande=`<div class="alert alert-warning" role="alert">
     Erreur, Veuillez réssayer !! 
    </div>`

    })
    setTimeout(() => {
      this.messageCommande=""
    }, 3000);
  }
makePayment(amount : any) {
  const paymentHandler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_51PFI24F29zVOYaoLNwA55lQnMETgMsgILXooIySTysEtaUYck09EzbfHklFnfQQm2zmmtZam1Ss796gimwKUNUv4006HgVUZXa',
    locale: 'auto',
    token: (stripeToken: any) => { // Utilisation d'une fonction fléchée pour conserver le contexte de 'this'
      console.log(stripeToken);
      alert('Paiement effectué avec succès!');
      this.reserver(this.reservation); // Appel à la fonction reserver() une fois le paiement réussi
    },
    
   
  });
  paymentHandler.open({
    name: '',
    description: '',
    amount:amount*100,
    currency: 'TND',
 
  });
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
        token: function (stripeToken: any) {
          console.log(stripeToken);
          
          console.log("hathy this.annonce",this.annonce),
          alert('Payment effectuée avec success!');
          
    
        },
      });
    };
    window.document.body.appendChild(script);
  }
}
addNewAvis() {
  if (
    !this.IsloggedIn
    
  )
  {
    this.toast.info({
      detail: 'Error Message',
      summary: 'Authentifiez-vous avant.',
    });
    this.connexion();
    
  } else
  {if (this.AvisForm.valid) {
    const data = this.AvisForm.value;
    let datas = this.service.getUserInfo();

    const avis = new Evaluation(undefined, data.commentaire, undefined, this.id, datas?.id);
    console.log("hathy avis ",avis)
    this.service.addEvaluation(avis).subscribe(
      (response: any) => {
        console.log("reseltut response " ,response);
        // Ajoutez l'avis à la liste existante
        this.listEvaluation.unshift(response); // Supposons que response contient l'avis ajouté avec un identifiant généré par le serveur
        // Réinitialisez le formulaire si nécessaire
        this.nbAvis=this.listEvaluation.length;
        const observables = this.listEvaluation.map(i => this.service.getClientByEvaluation(i.id));

      // Utiliser forkJoin pour attendre que toutes les requêtes soient terminées
      forkJoin(observables).subscribe(results => {
          this.listClientAvis = results;
          console.log("hatha list annonceur après ajout:", this.listClientAvis);
      });
        this.AvisForm.reset();
        // Affichez un message de succès
        this.toast.success({
          detail: 'Succès Message',
          summary: 'L\'avis est ajouté avec succès',
        });
      },
      (err) => {
        console.log(err);
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
  }}
}


}
