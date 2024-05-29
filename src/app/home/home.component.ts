import { Component } from '@angular/core';
import { Annonce } from '../Entites/Annonce.Entites';

import { Router } from '@angular/router';
import { CrudService } from '../service/crud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  
  listAnnonce: Annonce[];
  p:number=1;
  collection:any[]
  constructor(private service:CrudService,private router:Router ) { }
 
 
  selectedAddress: string = '';
  selectedAccommodationType: string = '';


  submitSearchForm() {
    // Récupérez les valeurs sélectionnées et passez-les à votre route /liste_annonce_public
    const address = this.selectedAddress;
    const accommodationType = this.selectedAccommodationType;
    // Si vous devez passer les valeurs sélectionnées en tant que paramètres de requête, vous pouvez les concaténer à l'URL
    this.router.navigate(['/liste_annonces_public'], { queryParams: { address: address, type: accommodationType } });
  }
  detailannonce(id: number): void {
    this.router.navigate(['/detailannonce', id]);
  }
 
 
  ngOnInit(): void {
    this.service.getAnnonce().subscribe(annonce => {
      this.listAnnonce = annonce
    })
  }

}
