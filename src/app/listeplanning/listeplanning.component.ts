import { Component } from '@angular/core';
import { Planning } from '../Entites/Planning.Entites';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../service/crud.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-listeplanning',
  templateUrl: './listeplanning.component.html',
  styleUrls: ['./listeplanning.component.css']
})
export class ListeplanningComponent {

  listeplanning: Planning[];
  p: number = 1;
  planning: Planning;
  PlanningForm: FormGroup;
  updateForm: FormGroup;
  id: number;
  userDetails: any;

  constructor(
    private service: CrudService,
    private router: Router,
    private activatedRoute: ActivatedRoute, // Utilisation d'ActivatedRoute
    private formBuilder: FormBuilder,
    private toast: NgToastService
  ) {
    
    let formControles = {
      heureDisponible: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-z A-Z .'-]+"),
        Validators.minLength(4),
      ]),
      jour: new FormControl('', [Validators.required]),
      adresse: new FormControl('', [Validators.required]),
      prixParHeure:new FormControl(['', Validators.required]) ,
      gouvernorat: ['', Validators.required],
    };
    this.updateForm = this.formBuilder.group(formControles);
  }
  get heureDisponible() {
    return this.updateForm.get('heureDisponible');
  }
  get jour() {
    return this.updateForm.get('jour');
  }
  get adresse() {
    return this.updateForm.get('adresse');
  }
  get prixParHeure() {
    return this.updateForm.get('prixParHeure');
  }
  get gouvernorat() {
    return this.updateForm.get('gouvernorat');
  }
  
 

  ngOnInit(): void {
    this.userDetails = this.service.getUserInfo();
    let idEvent = this.activatedRoute.snapshot.params['id'];
    this.id = idEvent;
    this.service.findPlanningById(this.id).subscribe((result) => {
      let event = result;
      console.log(event);
      this.updateForm.patchValue({
        heureDisponible: event.heureDisponible,
        jour: event.jour,
        adresse: event.adresse,
        prixParHeure: event.prixParHeure,
        gouvernorat:event.gouvernorat,
      });
    });
    this.PlanningForm = this.formBuilder.group({
      heureDisponible: ['', Validators.required], // Heure disponible
      jour: ['', Validators.required], // Jour
      adresse: ['', Validators.required], // Adresse
      prixParHeure: ['', Validators.required],
      gouvernorat: ['', Validators.required] // Prix par heure
    });
    this.service.listePlanificationByFdm(this.userDetails.id).subscribe(planning => {
      this.listeplanning = planning; 
    });
    

  }
  enselecte(id: number, planning: Planning)
  {
// Mettez à jour les valeurs dans votre formulaire
this.updateForm.patchValue({
  heureDisponible: planning.heureDisponible,
  jour: planning.jour,
  adresse: planning.adresse,
  prixParHeure: planning.prixParHeure,
  gouvernorat: planning.gouvernorat,
});
this.planning=planning;
  }
  
  updateplanning(id: number, planning: Planning) {
    let data = this.updateForm.value;
    let model = new Planning(planning.id, data.heureDisponible, data.jour, data.adresse, data.prixParHeure, planning.id_fdm,data.gouvernorat);

    console.log("Planning avant modification :", planning); // Affiche le planning avant modification
    console.log("Modèle après modification :", model); // Affiche le modèle avec les nouvelles données
    console.log("Données du formulaire :", data); // Affiche les données du formulaire

    this.service.updatePlanning(planning.id, model).subscribe(
        (res) => {
            console.log("Réponse du serveur :", res); // Affiche la réponse du serveur
            this.router.navigate(['/listeplanning']).then(() => {
                window.location.reload(); // Recharge la page après la navigation
            });
        },
        (err) => {
            console.error("Erreur lors de la mise à jour du planning :", err); // Affiche les erreurs éventuelles
        }
    );
}


  
  


  logout(): void {
    console.log("logout");
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  modifierProfil(id: number): void {
    this.router.navigate(['/modifierprofil', id]);
  }
  DeletePlanning(planning: Planning) {
    if (confirm("Voulez-vous supprimer votre planning ?")) {
      this.service.onDeletePlanning(planning.id).subscribe(() => {
        this.router.navigate(['/listeplanning']).then(() => {
          window.location.reload();
        });
      });
    }
  }
  addNewPlanning() {
    if (this.PlanningForm.valid) {
      const data = this.PlanningForm.value;
      const planning = new Planning(undefined, data.heureDisponible, data.jour, data.adresse, data.prixParHeure,this.userDetails.id,data.gouvernorat);

      this.service.addPlanning(planning).subscribe(
        () => {
          this.router.navigate(['/listeplanning']).then(() => {
            window.location.reload();
          });
          this.toast.success({
            detail: 'Succes Message',
            summary: 'Le planning est ajouté avec succès',
          });
          
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
