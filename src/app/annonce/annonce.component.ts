import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CrudService } from '../service/crud.service';
import { Annonce } from '../Entites/Annonce.Entites';
import {Saveannonce} from '../Entites/Saveannonce.Entites';
interface Equipementnterface {
  name: string;
  checked: boolean;
}
const equipement_bd = [
  { name: 'Wi-Fi', checked: false },
  { name: 'Cuisine', checked: false },
  { name: 'Télévision', checked: false },
  { name: 'Lave-linge', checked: false },
  { name: 'Climatisation', checked: false },
  { name: 'Chauffage', checked: false },
  { name: 'Fer', checked: false },
  { name: 'Parking', checked: false },
  { name: 'Literie', checked: false },
  { name: 'Meubles', checked: false },
  { name: 'Sécurité', checked: false },
  { name: 'Espace extérieur', checked: false },
];
const equipement_special_bd = [
  { name: 'Piscine privée', checked: false },
  { name: 'Jacuzzi', checked: false },
  { name: 'Sauna', checked: false },
  { name: 'Salle de cinéma', checked: false },
  { name: 'Salle de jeux', checked: false },
  { name: 'Barbecue', checked: false },
  { name: 'Terrasse panoramique', checked: false },
  { name: 'Jardin zen', checked: false },
  { name: 'Système de sonorisation', checked: false },
  { name: 'Système de sécurité avancé', checked: false },
  { name: 'Vue sur la mer', checked: false },
  { name: 'Accès direct à la plage', checked: false },
];
const equipement_securite_bd = [
  { name: 'Système alarme', checked: false },
  { name: 'Caméras de surveillance', checked: false },
  { name: 'Détecteurs de fumée', checked: false },
  { name: 'Détecteurs de monoxyde de carbone', checked: false },
  { name: 'Serrures de sécurité', checked: false },
  { name: 'Porte blindée', checked: false },
  { name: 'Éclairage extérieur automatique', checked: false },
  { name: 'Interphone vidéo', checked: false },
  { name: 'Coffre-fort', checked: false },
  { name: 'Garde de sécurité sur place', checked: false },
  { name: 'Contrôle accès électronique', checked: false },
  { name: 'Système de surveillance 24/7', checked: false },
];



@Component({
  selector: 'app-annonce',
  templateUrl: './annonce.component.html',
  styleUrls: ['./annonce.component.css']
})
export class AnnonceComponent {
  messageCommande = ""
  form: FormGroup;
  AnnonceForm: FormGroup;
  imagePath: any
  imgURL: any
  userFile: any
  message = ""
  equipments: Equipementnterface[];
  equipmentsSpecail: Equipementnterface[];
  equipmentsSecurite: Equipementnterface[];
  
  result: {
    selectedEquip: Equipementnterface[];
    
  } = { selectedEquip: [] };
  @ViewChild('quantityInput') quantityInput!: ElementRef;
  @ViewChild('quantityInput1') quantityInput1!: ElementRef;
  @ViewChild('quantityInput2') quantityInput2!: ElementRef;
  @ViewChild('quantityInput3') quantityInput3!: ElementRef;
  listeAnnonce: Annonce[]
  enableForm: boolean = true;
  enableForm2: boolean = true;
  Partie1Form: FormGroup;
  Partie2Form: FormGroup;
  selectedEquipNames:string[];
  selectedEquipSpecailNames: any;
  selectedEquipSecuriteNames: any;
  listtest:number[];
  constructor(
    private fb: FormBuilder,
    private service:CrudService,
    private router:Router,private toast:NgToastService
  ) {
    this.form = this.fb.group({
      equipments: this.fb.array([]),
      equipmentsSpecail: this.fb.array([]),
      equipmentsSecurite: this.fb.array([]),
      image: new FormControl( '', [
        Validators.required,]), // Assurez-vous que 'equipments' est bien un FormGroup dans votre formulaire
    });
  
    let formControlP1= {
      type_d_hebergement: new FormControl( '', [
        Validators.required,]),
    nb_voyageur: new FormControl( '', [
          Validators.required,]),
    nb_chamber: new FormControl( '', [
    Validators.required,]),
    nb_lits: new FormControl( '', [
    Validators.required,]),
    nb_salles: new FormControl( '', [
      Validators.required,]),
      description: new FormControl( '', [
        Validators.required,]),
    }
    let formControlP2 = {
      equipement: new FormControl( '', [
        Validators.required,]),
    equipement_specail: new FormControl( '', [
          Validators.required,]),
    equipement_securite: new FormControl( '', [
            Validators.required,]),
            image: new FormControl( '', [
              Validators.required,]),
      
    }
    let formControls = {
 
      
      
       titre: new FormControl( '', [
          Validators.required,]),
       mode_de_confirmation: new FormControl( '', [
          Validators.required,]),
          reduction_semaine: new FormControl( '', [
            Validators.required,]),
      reduction_mois: new FormControl( '', [
          Validators.required,]),
      prix: new FormControl( '', [
          Validators.required,]),
      pays: new FormControl( '', [
          Validators.required,]),
     
      ville: new FormControl( '', [
          Validators.required,]),
      code_postale: new FormControl( '', [
          Validators.required,]),
       heure_depart: new FormControl( '', [
          Validators.required,]),
      heure_arriver: new FormControl( '', [
          Validators.required,]),}
                    
    this.AnnonceForm = this.fb.group(formControls)
    this.Partie1Form= this.fb.group(formControlP1)
    this.Partie2Form = this.fb.group(formControlP2)
     
   }


   ngOnInit(): void {
    
    this.equipments = equipement_bd;
    this.equipmentsSpecail = equipement_special_bd;
    this.equipmentsSecurite = equipement_securite_bd;
    // build reactive form skeleton
    this.form = new FormGroup({
      
      // control for Checkbox exemple
      equipments: new FormArray([]),
      equipmentsSpecail: new FormArray([]),
      equipmentsSecurite: new FormArray([]),
    });
    // bind existing value to form control
    
    this._patchValues(this.equipments, 'equipments');
    this._patchValues(this.equipmentsSpecail, 'equipmentsSpecail');
    this._patchValues(this.equipmentsSecurite, 'equipmentsSecurite');

  }

  submitForm(): void {
    const { value } = this.form;
    // get selected equip from FormGroup value
    const selectedEquip =
        value?.equipments?.filter((f: Equipementnterface) => f.checked) || [];
        const selectedEquipSpecail =
        value?.equipmentsSpecail?.filter((f: Equipementnterface) => f.checked) || [];
        const selectedEquipSecurite =
        value?.equipmentsSecurite?.filter((f: Equipementnterface) => f.checked) || [];
    // equipement
    console.log('current form value equipement: ', value.equipments);
    console.log('only selected form value equipement: ', selectedEquip);
    console.log('original equipments list equipement: ', this.equipments);
//equipementspecail
    console.log('current form value equipementspecail: ', value.equipmentsSpecail);
    console.log('only selected form value equipementspecail: ', selectedEquipSpecail);
    console.log('original equipments list equipementspecail: ', this.equipmentsSecurite);
//equipement securite
    console.log('current form value equipement securite: ', value.equipmentsSecurite);
    console.log('only selected form value equipement securite: ', selectedEquipSecurite);
    console.log('original equipments list equipement securite: ', this.equipmentsSecurite);

    // Créer une nouvelle liste contenant uniquement les noms des équipements sélectionnés
    this.selectedEquipNames = selectedEquip.map((equip: Equipementnterface) => equip.name);
    this.selectedEquipSpecailNames = selectedEquipSpecail.map((equip: Equipementnterface) => equip.name);
    this.selectedEquipSecuriteNames = selectedEquipSecurite.map((equip: Equipementnterface) => equip.name);

    // Afficher la nouvelle liste de noms d'équipements sélectionnés
    console.log('selected equipment names: ', this.selectedEquipNames);
    console.log('selected equipment selectedEquipSpecailNames: ', this.selectedEquipSpecailNames);
    console.log('selected equipment selectedEquipSecuriteNames: ', this.selectedEquipSecuriteNames);


    

    
}



private _patchValues(equipments: Equipementnterface[], formControlName: string): void {
  // get array control
  const formArray = this.form.get(formControlName) as FormArray;
  // loop for each existing value
  equipments.forEach((equip) => {
    // add new control to FormArray
    formArray.push(
      // here the new FormControl with item value from equipement_bd
      new FormGroup({
        name: new FormControl(equip.name),
        checked: new FormControl(equip.checked),
      })
    );
  });
}
userFiles: any[] = []; // Pour stocker les fichiers sélectionnés
imgURLs: string[] = []; // Pour stocker les URLs des images
messages: string[] = []; // Pour stocker les messages d'erreur
urls: string[] = [];

    onSelect(e: any) {
        if (e.target.files && e.target.files.length > 0) {
            const files: File[] = Array.from(e.target.files); // Assurer que files est de type File[]
            const fileReaders: Promise<string>[] = files.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (event: any) => resolve(event.target.result);
                    reader.onerror = reject;
                });
            });

            // Utiliser Promise.all pour attendre que tous les fichiers soient lus
            Promise.all(fileReaders)
                .then(results => {
                  console.log("hathy resultat ",results)
                    this.urls = results;
                    console.log("URLs des fichiers :", this.urls);
                })
                .catch(error => {
                    console.error("Erreur lors de la lecture des fichiers :", error);
                });

        }
    }


onSelectFile(event: any) {
  if (event.target.files.length > 0) {
    const files = event.target.files;
    this.userFiles = []; // Initialisez un tableau pour stocker les fichiers
    this.imgURLs = []; // Initialisez un tableau pour stocker les URLs des images
    this.messages = []; // Initialisez un tableau pour stocker les messages d'erreur

    for (let file of files) {
      var mimeType = file.type;
      if (mimeType.match(/image\/*/) == null) {
        this.messages.push('Only images are supported for file: ' + file.name);
        continue;
      }

      this.userFiles.push(file);

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        this.imgURLs.push(reader.result as string);
      };
    }
console.log("hatha this.imageUrls",this.imgURLs)
    if (this.messages.length > 0) {
      this.message = this.messages.join(' ');
    } else {
      this.message = '';
    }
  }
}

  
  
  get type_d_hebergement() { return this.Partie1Form.get('type_d_hebergement'); }
  get nb_voyageur() 
  { const value = this.quantityInput.nativeElement.value;
    return value; }
  get nb_chamber() { const value = this.quantityInput1 ? this.quantityInput1.nativeElement.value : '';
    return value; }
  get nb_lits() { const value = this.quantityInput2.nativeElement.value;
    return value;}
  get nb_salles() { const value = this.quantityInput3 ? this.quantityInput1.nativeElement.value : ''
    return value; }
  get description() { return this.Partie1Form.get('description'); }
  
  get image() { return this.form.get('image'); }
  get titre() { return this.AnnonceForm.get('titre'); }
  get reduction_semaine() { return this.AnnonceForm.get('reduction_semaine'); }
  get reduction_mois() { return this.AnnonceForm.get('reduction_mois'); }
  get prix() { return this.AnnonceForm.get('prix'); }
  get pays() { return this.AnnonceForm.get('pays'); }
  get ville() { return this.AnnonceForm.get('ville'); }
  get code_postale() { return this.AnnonceForm.get('code_postale'); }
  get heure_depart() { return this.AnnonceForm.get('heure_depart'); }
  get heure_arriver() { return this.AnnonceForm.get('heure_arriver'); }

  done() {
    this.submitForm();
    let data = this.Partie1Form.value;
    
    console.log("data avant "+data);
    this.listtest=[this.nb_chamber,this.nb_lits,this.nb_salles,this.nb_voyageur];
    console.log(data.type_d_hebergement,this.nb_voyageur,this.nb_chamber,this.nb_lits,this.nb_salles,data.description,);
    console.log("liste test: "+ this.listtest);
    console.log("image hathy : ",this.imgURL)
    
    if (
      data.type_d_hebergement == 0 ||
      data.description ==0 ||
      this.selectedEquipNames.length == 0 ||
      this.selectedEquipSpecailNames.length == 0 ||
      this.selectedEquipSecuriteNames.length == 0 
      

    )
    {
      this.toast.info({
        detail: 'Error Message',
        summary: 'Remplir votre champs',
      });
    } else {
      
  this.enableForm=false
      
      console.log(this.enableForm);
    }
  }
    

  // Méthode pour récupérer la valeur de l'input
  getValue(): number {
    const value = this.quantityInput.nativeElement.value;
    return value; // ou utilisez la valeur comme vous le souhaitez
  }
  addNewAnnonce() {
    console.log("d5al lhna ");
    let datas=this.service.getUserInfo();
    let data = this.AnnonceForm.value;
    let data1 = this.Partie1Form.value;
    console.log(data);
    
    let model: Saveannonce= new Saveannonce();
    console.log("wsol lhne");
    
    model.type_d_hebergement=data1.type_d_hebergement;
       model.nb_voyageur= this.listtest[3];
       model.nb_chamber=this.listtest[0];
       model.nb_lits=this.listtest[1];
       model.nb_salles=this.listtest[2];
      model.equipement=this.selectedEquipNames;
       model.equipement_specail=this.selectedEquipSpecailNames;
      model.equipement_securite=this.selectedEquipSecuriteNames;
      model.titre=data.titre;
      model.description=data1.description;
      model.reduction_semaine=data.reduction_semaine;
      model.reduction_mois=data.reduction_mois;
      model.prix=data.prix;
      model.pays=data.pays;
    model.image=this.urls;
      model.ville=data.ville;
      model.code_postale=data.code_postale;
      model.heure_depart=data.heure_depart;
      model.heure_arriver=data.heure_arriver;
   
      model.id_annonceur=datas?.id;
      console.log(model.id_annonceur);
      console.log("model hatha " , model);
  
      if (
      data.titre == 0 ||
      data.reduction_semaine == 0 ||
      data.reduction_mois == 0 ||
      data.prix == 0 ||
      data.pays == 0 ||
      data.ville == 0 ||
      data.code_postale == 0 ||
      data.heure_depart == 0 ||
      data.heure_arriver == 0 
      ) {
        this.messageCommande = `<div class="alert alert-danger" role="alert">
      remplir votre champ 
    </div>`
    } else {
   
      this.service.addAnnonce(model).subscribe(
        res => {
          console.log(res);
          this.messageCommande = `<div class="alert alert-success" role="alert">
        Message envoyer avec succe
      </div>`

          this.router.navigate(['/liste_annonce']).then(()=>{window.location.reload()})
            ;
        },
        err => {
          this.messageCommande = `<div class="alert alert-warning" role="alert">
        service en panne!!!! 
      </div>`

        })
      setTimeout(() => {
        this.messageCommande = ""
      }, 3000);

    }
  }


  
  onPropertyTypeChange(event: Event) {
    // Vous pouvez ajouter votre logique de traitement ici
    console.log('Type de propriété changé :', (event.target as HTMLInputElement).value);
  }
}
