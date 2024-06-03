import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utilisateur } from '../Entites/Utilisateur.Entites';
import { CrudService } from '../service/crud.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-modifier-profil-femme',
  templateUrl: './modifier-profil-femme.component.html',
  styleUrls: ['./modifier-profil-femme.component.css']
})
export class ModifierProfilFemmeComponent {

  updateForm: FormGroup;
  id: number;
  currentUtilisateur = new Utilisateur()
  userFile: any;
  imagePath: any
  imgURL: any
  userDetails: any;
  public message!: string;
  constructor(
    private fb: FormBuilder,
    private service: CrudService,
    private route: Router,
    private router: ActivatedRoute,private toast:NgToastService
  ) 
  {
    this.userDetails = this.service.getUserInfo();

    let formControles = {
      nom: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-z A-Z .'-]+"), 
        Validators.minLength(4),
      ]),
      prenom: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
      mdp: new FormControl('', [Validators.required]),
      adresse: new FormControl('', [Validators.required]),
      telephone: new FormControl('', [Validators.required]),
      confirmPassword: ['', Validators.required],
    role: ['', Validators.required],
    date_de_naissance: [''],
    photo: ['']
     
    };
    this.updateForm = this.fb.group(formControles);
  }

  get nom() {
    return this.updateForm.get('nom');
  }
  get prenom() {
    return this.updateForm.get('prenom');
  }
  get email() {
    return this.updateForm.get('email');
  }
  get mdp() {
    return this.updateForm.get('mdp');
  }
  get adresse() {
    return this.updateForm.get('adresse');
  }
  get telephone() {
    return this.updateForm.get('telephone');
  }
get role() { return this.updateForm.get('role'); }
get date_de_naissance() { return this.updateForm.get('date_de_naissance'); }
get photo (){return this.updateForm.get('photo');}

onSelectFile(event: any) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.userFile = file;
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    var reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
  }
}
  
  ngOnInit(): void {
    let idEvent = this.router.snapshot.params['id'];
    this.id = idEvent;
    this.service.findUtilisateurById(idEvent).subscribe((result) => {
      let event = result;
      console.log(event);
      this.updateForm.patchValue({
        nom: event.nom,
        prenom: event.prenom,
        email: event.email,
        date_de_naissance: event.date_de_naissance,
        telephone: event.telephone,
        adresse: event.adresse,
        mdp: event.mdp,
        role: event.role, });
      }); 
      }
      updateUtilisateur() {
        let data = this.updateForm.value;
        let utilisateur =new Utilisateur(
          this.id,
          data.nom,
          data.prenom,
          data.email,
          data.date_de_naissance,
          data.telephone,
          data.adresse,
          data.mdp, 
          data.role,
          true,
          this.imgURL);
        console.log("hatha utilisateu",utilisateur);
        console.log("hathy data ",data);
        this.service.updateUtilisateur(this.id,utilisateur).subscribe((res) => {
          
          console.log(res);
          this.toast.info({
            detail: 'Modifier avec succée',
            summary: 'valide',
          });
          this.route.navigate(['/profilfemme'])}); }
  
      

}


