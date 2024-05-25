import { Component } from '@angular/core';
import { CrudService } from '../service/crud.service';
import { Router } from '@angular/router';
import { Annonce } from '../Entites/Annonce.Entites';

@Component({
  selector: 'app-liste-annonces-public',
  templateUrl: './liste-annonces-public.component.html',
  styleUrls: ['./liste-annonces-public.component.css']
})
export class ListeAnnoncesPublicComponent {

  listAnnonce: Annonce[];
  p:number = 1;
  collection: any[];
  searchQuery: string = '';
  activeAnnonce: string = '';

  constructor(private service: CrudService, private router: Router) { }

  detailannonce(id: number): void {
    this.router.navigate(['/detailannonce', id]);
  }

  ngOnInit(): void {
    this.service.getAnnonce().subscribe(annonce => {
      this.listAnnonce = annonce;
    });
  }
  
  setActiveAnnonce(typeDHebergement: string): void {
    this.activeAnnonce = typeDHebergement;
  }

  searchAnnonces(): void {
    if (this.searchQuery.trim() !== '') {
      this.listAnnonce = this.listAnnonce.filter(annonce =>
        annonce.type_d_hebergement.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.getAnnonces(); // Si le champ de recherche est vide, afficher toutes les annonces
    }
  }

  private getAnnonces(): void {
    this.service.getAnnonce().subscribe(annonces => {
      this.listAnnonce = annonces;
    });
  }

  get filteredAnnonce(): Annonce[] {
    let filtered = this.listAnnonce;

    if (this.activeAnnonce) {
      filtered = filtered.filter(annonce => annonce.type_d_hebergement === this.activeAnnonce);
    }

    return filtered;
  }
}
